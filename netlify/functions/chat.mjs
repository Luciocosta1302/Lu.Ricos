/* ============================================================
   Netlify Function — POST /api/chat
   A chave da IA fica só aqui (variável de ambiente no Netlify).
   ============================================================ */
import { handleChat } from '../lib/http.mjs';
import { loadCatalog } from '../lib/catalog.mjs';
import { createRateLimiter } from '../lib/agent.mjs';
import { getProvider, classifyError } from '../lib/providers/index.mjs';

const rateLimit = createRateLimiter();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

export default async (req, context) => handleChat(req, {
  ip: context?.ip || req.headers.get('x-nf-client-connection-ip') || '',
  provider: getProvider(process.env),
  loadCatalog,
  rateLimit,
  classifyError,
  allowedOrigins,
});

export const config = { path: '/api/chat' };
