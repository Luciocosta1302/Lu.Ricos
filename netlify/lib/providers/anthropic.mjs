/* ============================================================
   Provedor: Anthropic (Claude) — SDK oficial @anthropic-ai/sdk
   Contrato comum a todos os provedores:
     run({ system, history, tools, executeTool, maxSteps })
       -> { text: string, refused?: boolean }
   ============================================================ */
import Anthropic from '@anthropic-ai/sdk';

export function createAnthropicProvider({ apiKey, model = 'claude-opus-5-5', effort = 'low', timeoutMs = 22_000 } = {}) {
  const client = new Anthropic({ apiKey, timeout: timeoutMs, maxRetries: 1 });

  return {
    name: 'anthropic',
    model,
    async run({ system, history, tools, executeTool, maxSteps }) {
      const apiTools = tools.map(t => ({ name: t.name, description: t.description, input_schema: t.parameters }));
      const messages = history.map(m => ({ role: m.role, content: m.content }));

      for (let step = 0; step < maxSteps; step++) {
        const isLast = step === maxSteps - 1;
        const res = await client.beta.messages.create({
          model,
          max_tokens: 8000,
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default', // se o modelo recusar, a API refaz a chamada no modelo recomendado
          output_config: { effort }, // conversa de vendas: esforço baixo = respostas rápidas e baratas
          system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
          tools: apiTools,
          // Na última rodada permitida, impede novas chamadas de ferramenta para garantir uma resposta final
          ...(isLast ? { tool_choice: { type: 'none' } } : {}),
          messages,
        });

        if (res.stop_reason === 'refusal') return { text: '', refused: true };

        const text = res.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
        if (res.stop_reason !== 'tool_use') return { text };

        // Mantém o conteúdo da resposta inalterado (inclui blocos de raciocínio) e devolve os resultados
        messages.push({ role: 'assistant', content: res.content });
        const results = res.content.filter(b => b.type === 'tool_use').map(b => {
          let content, isError = false;
          try { content = JSON.stringify(executeTool(b.name, b.input)); }
          catch (e) { content = JSON.stringify({ erro: 'Falha ao consultar o catálogo.' }); isError = true; }
          return { type: 'tool_result', tool_use_id: b.id, content, ...(isError ? { is_error: true } : {}) };
        });
        messages.push({ role: 'user', content: results });
      }
      return { text: '' };
    },
  };
}

/** Converte erros do SDK em códigos simples para a interface. */
export function classifyAnthropicError(err) {
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) return 'config';
  if (err instanceof Anthropic.RateLimitError) return 'busy';
  if (err instanceof Anthropic.BadRequestError) return 'bad_request';
  if (err instanceof Anthropic.APIConnectionTimeoutError || err instanceof Anthropic.APIConnectionError) return 'unavailable';
  if (err instanceof Anthropic.APIError) return 'unavailable';
  return null;
}
