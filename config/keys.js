// DO NOT hardcode secrets here. This module resolves API keys from runtime sources.
// Priority: window vars -> localStorage -> environment vars -> empty string

function getFromWindowOrLocalStorage(name) {
  try {
    if (typeof window !== 'undefined') {
      if (window[name]) return window[name];
      if (window.localStorage) {
        const v = window.localStorage.getItem(name);
        if (v) return v;
      }
    }
  } catch (_) {}
  return '';
}

export const OPENAI_API_KEY =
  getFromWindowOrLocalStorage('OPENAI_API_KEY') ||
  (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) ||
  '';

export const ANTHROPIC_API_KEY =
  getFromWindowOrLocalStorage('ANTHROPIC_API_KEY') ||
  (typeof process !== 'undefined' && process.env && process.env.ANTHROPIC_API_KEY) ||
  '';

export default { OPENAI_API_KEY, ANTHROPIC_API_KEY };

