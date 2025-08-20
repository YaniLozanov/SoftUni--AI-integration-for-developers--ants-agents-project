import { createAnt as storeCreateAnt, getAnts, getAnt as storeGetAnt, setAnt as storeSetAnt } from '../stores/antsStore.js';
import { OPEN_AI_CONFIG } from '../config/config.js';
import { getNextAntName, generateRandomTopP, generateRandmTemperature } from '../utils/antUtils.js';

export function createAnt(config = {}) {
  const name = (config.name && String(config.name).trim()) || getNextAntName(getAnts().map(a => a.name));
  const randomTopP = generateRandomTopP();
  const randomTemperature = generateRandmTemperature();
  const preparedConfig = {
    ...OPEN_AI_CONFIG,
    topP: randomTopP,
    temperature: randomTemperature,
    ...config,
    name
  };
  return storeCreateAnt(preparedConfig);
}

export function updateAnt(identifier, updates = {}) {
  const ant = storeGetAnt(identifier);

  if (!ant) return null;

  // Apply and validate updates in the service layer
  if (typeof updates.name === 'string') {
    ant.name = updates.name.trim();
  }
  if (typeof updates.model === 'string') {
    ant.model = updates.model;
  }
  if (updates.topP !== undefined) {
    const topP = Number(updates.topP);
    if (Number.isFinite(topP)) ant.topP = Math.max(0, Math.min(1, topP));
  }
  if (updates.temperature !== undefined) {
    const temperature = Number(updates.temperature);
    if (Number.isFinite(temperature)) ant.temperature = Math.max(0, Math.min(2, temperature));
  }

  // Hand updated ant to the store to persist
  return storeSetAnt(ant);
}

export default {
  createAnt,
  updateAnt,
  getAnts
};


