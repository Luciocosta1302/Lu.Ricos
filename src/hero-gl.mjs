/* ============================================================
   LU.RICOS — mostrador da home em WebGL (Three.js)
   Fonte. O arquivo publicado é assets/hero-gl.js, gerado com:
     npm run build:gl
   - Fotos reais em "cover" dentro de um quadro quadrado (o círculo
     é recortado pelo CSS), com ponto de foco por foto.
   - Troca de foto com deslocamento por ruído (dissolve líquido).
   - Lente que segue o ponteiro, suavizada por uma mola
     (tensão/atrito, modelo do guia de física do react-spring).
   Expõe window.LRDialGL.create(host, slides) e não faz nada se o
   navegador não tiver WebGL: o app.js mantém as <img> de reserva.
   ============================================================ */
import {
  WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, Mesh, ShaderMaterial,
  TextureLoader, Vector2, LinearSRGBColorSpace, NoColorSpace, LinearFilter,
} from 'three';

const vertex = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragment = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uA;
  uniform sampler2D uB;
  uniform vec3 uFitA;   // (aspecto w/h, foco x, foco y)
  uniform vec3 uFitB;
  uniform float uProgress;
  uniform vec2 uPointer; // 0..1
  uniform float uHover;  // 0..1
  uniform float uSeed;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

  // "object-fit: cover" num quadro quadrado, com ponto de foco
  vec2 cover(vec2 uv, vec3 fit) {
    float a = fit.x;
    vec2 scale = a < 1.0 ? vec2(1.0, a) : vec2(1.0 / a, 1.0);
    vec2 c = clamp(fit.yz, scale * 0.5, 1.0 - scale * 0.5);
    return (uv - 0.5) * scale + c;
  }

  void main() {
    vec2 uv = vUv;

    // lente: aumenta a área em volta do ponteiro
    vec2 d = uv - uPointer;
    float r = length(d);
    float lens = smoothstep(0.26, 0.0, r) * uHover;
    uv = uPointer + d * (1.0 - 0.32 * lens);

    // troca de foto: ruído decide onde a nova imagem aparece primeiro
    float n = fbm(uv * 3.2 + uSeed);
    float w = 0.18;
    float t = smoothstep(n - w, n + w, uProgress * (1.0 + 2.0 * w) - w);
    vec2 push = vec2(n - 0.5, fbm(uv * 3.2 + uSeed + 7.0) - 0.5) * 0.22;
    vec4 a = texture2D(uA, cover(uv + push * t, uFitA));
    vec4 b = texture2D(uB, cover(uv - push * (1.0 - t), uFitB));
    vec3 col = mix(a.rgb, b.rgb, t);

    // vinheta suave para o círculo e um grão discreto de foto
    float v = smoothstep(0.75, 0.2, length(vUv - 0.5));
    col *= mix(0.86, 1.0, v);
    col += (hash(vUv * 900.0 + uSeed) - 0.5) * 0.035;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* mola crítica-amortecida (tensão/atrito/massa), integrada por Euler semi-implícito */
function spring(value, { tension = 120, friction = 14, mass = 1 } = {}) {
  const s = { value, target: value, v: 0, step(dt) {
    const f = -tension * (s.value - s.target) - friction * s.v;
    s.v += (f / mass) * dt; s.value += s.v * dt;
    return Math.abs(s.v) > 1e-4 || Math.abs(s.value - s.target) > 1e-4;
  } };
  return s;
}

function create(host, slides) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  } catch (e) { return null; }
  if (!renderer.getContext()) return null;
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.domElement.className = 'dial-gl';
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uA: { value: null }, uB: { value: null },
    uFitA: { value: [1, .5, .5] }, uFitB: { value: [1, .5, .5] },
    uProgress: { value: 0 }, uPointer: { value: new Vector2(.5, .5) }, uHover: { value: 0 }, uSeed: { value: 0 },
  };
  const mat = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms });
  scene.add(new Mesh(new PlaneGeometry(2, 2), mat));

  const loader = new TextureLoader();
  const textures = [];
  const load = i => textures[i] || (textures[i] = new Promise(res => loader.load(slides[i].img, tex => {
    tex.colorSpace = NoColorSpace; tex.minFilter = LinearFilter; tex.generateMipmaps = false;
    const img = tex.image; res({ tex, fit: [img.width / img.height, ...(slides[i].focus || [.5, .5])] });
  }, undefined, () => res(null))));

  const px = spring(.5), py = spring(.5), hover = spring(0, { tension: 90, friction: 16 });
  let cur = 0, anim = null, raf = 0, last = 0, size = 0;

  const resize = () => {
    const s = Math.round(host.getBoundingClientRect().width);
    if (s && s !== size) { size = s; renderer.setSize(s, s, false); frame(); }
  };
  const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;

  function frame(now = performance.now()) {
    const dt = Math.min(.05, last ? (now - last) / 1000 : .016); last = now;
    let busy = px.step(dt) | py.step(dt) | hover.step(dt);
    uniforms.uPointer.value.set(px.value, py.value);
    uniforms.uHover.value = Math.max(0, hover.value);
    if (anim) {
      const p = Math.min(1, (now - anim.t0) / anim.dur);
      uniforms.uProgress.value = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      if (p >= 1) { // fixa a nova foto como A
        uniforms.uA.value = uniforms.uB.value; uniforms.uFitA.value = uniforms.uFitB.value;
        uniforms.uProgress.value = 0; anim = null;
      } else busy = 1;
    }
    renderer.render(scene, camera);
    raf = busy ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  const api = {
    canvas: renderer.domElement,
    ready: load(0).then(first => {
      if (!first) throw new Error('foto inicial não carregou');
      uniforms.uA.value = first.tex; uniforms.uFitA.value = first.fit;
      host.appendChild(renderer.domElement);
      ro ? ro.observe(host) : addEventListener('resize', resize);
      resize(); frame();
      slides.forEach((_, i) => i && load(i)); // pré-carrega o resto
      return api;
    }),
    async show(i) {
      if (i === cur) return;
      const next = await load(i);
      if (!next) return;
      if (anim) { uniforms.uA.value = uniforms.uB.value; uniforms.uFitA.value = uniforms.uFitB.value; }
      cur = i;
      uniforms.uB.value = next.tex; uniforms.uFitB.value = next.fit;
      uniforms.uSeed.value = Math.random() * 10;
      anim = { t0: performance.now(), dur: 1300 };
      kick();
    },
    pointer(x, y, active) { px.target = x; py.target = 1 - y; hover.target = active ? 1 : 0; kick(); },
  };
  return api;
}

window.LRDialGL = { create };
