/* ============================================================
   Tratamento HTTP do endpoint /api/chat (testável sem Netlify).
   ============================================================ */
import { answer, validateHistory, InputError, LIMITS } from './agent.mjs';

const json = (status, data, extra = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra },
});

const MESSAGES = {
  config: 'O assistente está em manutenção. Fale com a gente pelo WhatsApp.',
  busy: 'Muita gente conversando agora. Tente de novo em instantes ou fale pelo WhatsApp.',
  unavailable: 'O assistente está fora do ar no momento. Fale com a gente pelo WhatsApp.',
  bad_request: 'Não consegui processar essa mensagem. Pode reformular?',
};

/** Só aceita chamadas do próprio site (ou das origens listadas em ALLOWED_ORIGINS). */
function originAllowed(req, allowedOrigins) {
  const origin = req.headers.get('origin');
  if (!origin) return true; // mesma origem em navegadores antigos / ferramentas de teste
  const self = new URL(req.url).origin;
  return origin === self || allowedOrigins.includes(origin);
}

export async function handleChat(req, { ip, provider, loadCatalog, rateLimit, classifyError, allowedOrigins = [], log = console }) {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' }, { allow: 'POST' });
  if (!originAllowed(req, allowedOrigins)) return json(403, { error: 'forbidden' });
  if (!(req.headers.get('content-type') || '').includes('application/json')) return json(415, { error: 'unsupported_media_type' });
  if (!rateLimit(ip)) return json(429, { error: 'rate_limited', message: 'Você enviou muitas mensagens seguidas. Aguarde um minuto.' });

  let history;
  try {
    const raw = await req.text();
    if (raw.length > LIMITS.maxBodyBytes) throw new InputError('Conversa muito longa. Recomece o chat.');
    history = validateHistory(JSON.parse(raw));
  } catch (e) {
    return json(400, { error: 'invalid_input', message: e instanceof InputError ? e.message : 'Formato inválido.' });
  }

  if (!provider) return json(503, { error: 'config', message: MESSAGES.config, handoff: true });

  let catalog;
  try { catalog = await loadCatalog({ origin: new URL(req.url).origin }); }
  catch (e) { log.error('[chat] catálogo', e?.message); return json(503, { error: 'catalog', message: MESSAGES.unavailable, handoff: true }); }

  try {
    const out = await answer({ catalog, history, provider });
    return json(200, out);
  } catch (e) {
    const code = classifyError(e);
    log.error('[chat] provedor', code, e?.status || '', e?.message);
    return json(code === 'bad_request' ? 400 : 503, { error: code, message: MESSAGES[code] || MESSAGES.unavailable, handoff: code !== 'bad_request' });
  }
}
