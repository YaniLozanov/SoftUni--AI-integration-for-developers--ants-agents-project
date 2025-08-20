import { OPEN_AI_CONFIG } from '../config/config.js';

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export class Ant {
  constructor(config = {}) {
    const {
      id,
      name = OPEN_AI_CONFIG.name,
      model = OPEN_AI_CONFIG.model,
      topP = OPEN_AI_CONFIG.topP,
      temperature = OPEN_AI_CONFIG.temperature,
      systemPrompt = OPEN_AI_CONFIG.systemPrompt,
      prompt = OPEN_AI_CONFIG.prompt,
      maxOutputTokens = OPEN_AI_CONFIG.maxOutputTokens
    } = config;

    this.id = id || generateId();
    this.name = name;
    this.model = model;
    this.topP = topP;
    this.temperature = temperature;
    this.systemPrompt = systemPrompt;
    this.prompt = prompt;
    this.maxOutputTokens = maxOutputTokens;
  }
}

export default Ant;


