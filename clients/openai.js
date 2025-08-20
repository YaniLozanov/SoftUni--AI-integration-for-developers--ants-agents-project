/**
 * Basic OpenAI client for chat completions.
 * Expects the API key to be available as `window.OPENAI_API_KEY` or in `localStorage` under `OPENAI_API_KEY`.
 */
import { OPEN_AI_CONFIG } from '../config/config.js';
import { OPENAI_API_KEY } from '../config/keys.js';

/**
 * Calls OpenAI with the provided parameters and returns the response text and raw payload.
 *
 * Preferred: pass a single config object. Any missing fields are filled from OPEN_AI_CONFIG.
 * Backward compatible: positional args (model, topP, temperature, systemPrompt, prompt, maxOutputTokens).
 *
 * @param {object|string} configOrModel - Config object or model string.
 * @param {number} [topP]
 * @param {number} [temperature]
 * @param {string} [systemPrompt]
 * @param {string} [prompt]
 * @param {number} [maxOutputTokens]
 * @returns {Promise<{ text: string, raw: any }>} The assistant message text and the raw API response.
 */
export async function requestOpenAI(configOrModel, topP, temperature, systemPrompt, prompt, maxOutputTokens) {
  const apiKey = OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not found. Set `window.OPENAI_API_KEY` or `localStorage[\'OPENAI_API_KEY\']`.');
  }

  const url = 'https://api.openai.com/v1/chat/completions';

  const providedConfig = typeof configOrModel === 'object' && configOrModel !== null
    ? configOrModel
    : {
        model: configOrModel,
        topP,
        temperature,
        systemPrompt,
        prompt,
        maxOutputTokens
      };

  const cfg = { ...OPEN_AI_CONFIG, ...providedConfig };

  const body = {
    model: String(cfg.model),
    messages: [
      { role: 'system', content: cfg.systemPrompt ?? '' },
      { role: 'user', content: cfg.prompt ?? '' }
    ],
    temperature: typeof cfg.temperature === 'number' ? cfg.temperature : Number(cfg.temperature) || OPEN_AI_CONFIG.temperature,
    top_p: typeof cfg.topP === 'number' ? cfg.topP : Number(cfg.topP) || OPEN_AI_CONFIG.topP,
    max_tokens: typeof cfg.maxOutputTokens === 'number' ? cfg.maxOutputTokens : Number(cfg.maxOutputTokens) || OPEN_AI_CONFIG.maxOutputTokens
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content ?? '';
  return { text, raw: data };
}

export default requestOpenAI;


