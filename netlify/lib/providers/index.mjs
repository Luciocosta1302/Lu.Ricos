/* ============================================================
   Escolha do provedor de IA por variável de ambiente.
   Para usar OpenAI no futuro: crie providers/openai.mjs com o
   mesmo contrato run({ system, history, tools, executeTool,
   maxSteps }) -> { text, refused? } e registre abaixo.
   ============================================================ */
import { createAnthropicProvider, classifyAnthropicError } from './anthropic.mjs';

export function getProvider(env = process.env) {
  const name = (env.AI_PROVIDER || 'anthropic').toLowerCase();
  if (name === 'anthropic') {
    if (!env.ANTHROPIC_API_KEY) return null;
    return createAnthropicProvider({
      apiKey: env.ANTHROPIC_API_KEY,
      model: env.AI_MODEL || 'claude-opus-5-5',
      effort: env.AI_EFFORT || 'low',
    });
  }
  // if (name === 'openai') return createOpenAIProvider({ apiKey: env.OPENAI_API_KEY, model: env.AI_MODEL });
  return null;
}

export function classifyError(err) {
  return classifyAnthropicError(err) || 'unavailable';
}
