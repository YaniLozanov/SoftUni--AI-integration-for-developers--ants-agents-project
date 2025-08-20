/**
 * Claude client for Anthropic Messages API.
 * Reads API key from `window.ANTHROPIC_API_KEY` or `localStorage.ANTHROPIC_API_KEY`.
 */
import { CLAUDE_CONFIG } from '../config/config.js';
import { ANTHROPIC_API_KEY } from '../config/keys.js';
import { CLAUDE_TOOLS } from '../utils/claudeTools.js';

/**
 * Calls Claude with provided config or positional args (backward-compatible style).
 * Preferred usage: single config object merged with CLAUDE_CONFIG.
 *
 * @param {object|string} configOrModel - Config object or model string.
 * @param {number} [topP]
 * @param {number} [temperature]
 * @param {string} [systemPrompt]
 * @param {string} [prompt]
 * @param {number} [maxOutputTokens]
 * @returns {Promise<{ text: string, raw: any }>} The assistant message text and the raw API response.
 */
export async function requestClaude(configOrModel, topP, temperature, systemPrompt, prompt, maxOutputTokens) {
  const apiKey = ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('Anthropic API key not found. Set `window.ANTHROPIC_API_KEY` or `localStorage[\'ANTHROPIC_API_KEY\']`.');
  }

  const url = 'https://api.anthropic.com/v1/messages';

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

  const cfg = { ...CLAUDE_CONFIG, ...providedConfig };
  // Default tools come only from claudeTools.js; ignore any tools embedded in CLAUDE_CONFIG
  const tools = Array.isArray(providedConfig?.tools)
    ? providedConfig.tools
    : (Array.isArray(CLAUDE_TOOLS) ? CLAUDE_TOOLS : []);

  // We only support custom JSON-schema tools (no built-in computer-use). No beta headers needed.

  const body = {
    model: String(cfg.model),
    max_tokens: typeof cfg.maxOutputTokens === 'number' ? cfg.maxOutputTokens : Number(cfg.maxOutputTokens) || CLAUDE_CONFIG.maxOutputTokens,
    system: cfg.systemPrompt ?? '',
    messages: Array.isArray(cfg.messages) && cfg.messages.length > 0
      ? cfg.messages.map(m => ({ role: m.role, content: m.content }))
      : [{ role: 'user', content: cfg.prompt ?? '' }],
    temperature: typeof cfg.temperature === 'number' ? cfg.temperature : Number(cfg.temperature) || CLAUDE_CONFIG.temperature,
    top_p: typeof cfg.topP === 'number' ? cfg.topP : Number(cfg.topP) || CLAUDE_CONFIG.topP,
    ...(tools.length > 0 ? { tools } : {})
  };

  const headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  };

  const response = await fetch(url, headers);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text ?? '';
  return { text, raw: data };
}

export default requestClaude;


