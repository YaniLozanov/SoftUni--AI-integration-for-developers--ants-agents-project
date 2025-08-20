import Ant from '../models/Ant.js';

// In-memory store of Ant instances
export const ants = [];

// Create
export function createAnt(config = {}) {
  const ant = new Ant(config);
  ants.push(ant);
  console.log(ants);
  return ant;
}

// Read all (returns a shallow copy)
export function getAnts() {
  return ants.slice();
}

// Read one by id or index
export function getAnt(identifier) {
  if (typeof identifier === 'number') {
    if (identifier < 0 || identifier >= ants.length) return null;
    return ants[identifier];
  }
  if (typeof identifier === 'string') {
    return ants.find(a => a.id === identifier) || null;
  }
  return null;
}

// Update by id or index with a partial object of allowed fields
export function updateAnt(identifier, updates = {}) {
  const target = typeof identifier === 'number'
    ? (identifier < 0 || identifier >= ants.length ? null : ants[identifier])
    : (typeof identifier === 'string' ? ants.find(a => a.id === identifier) : null);

  if (!target) return null;
  const allowed = ['name', 'model', 'topP', 'temperature', 'systemPrompt', 'prompt', 'maxOutputTokens'];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      target[key] = updates[key];
    }
  }
  return target;
}

// Replace values of an existing ant using the provided ant object (matched by id)
export function setAnt(updatedAnt) {
  if (!updatedAnt || typeof updatedAnt !== 'object' || !updatedAnt.id) return null;
  const target = ants.find(a => a.id === updatedAnt.id);
  if (!target) return null;
  const allowed = ['name', 'model', 'topP', 'temperature', 'systemPrompt', 'prompt', 'maxOutputTokens'];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updatedAnt, key)) {
      target[key] = updatedAnt[key];
    }
  }

  console.log(ants);
  return target;
}

// Delete by id or index
export function deleteAnt(identifier) {
  if (typeof identifier === 'number') {
    if (identifier < 0 || identifier >= ants.length) return false;
    ants.splice(identifier, 1);
    return true;
  }
  if (typeof identifier === 'string') {
    const idx = ants.findIndex(a => a.id === identifier);
    if (idx === -1) return false;
    ants.splice(idx, 1);
    return true;
  }
  return false;
}

// Clear all
export function clearAnts() {
  ants.length = 0;
}

export default {
  ants,
  createAnt,
  getAnts,
  getAnt,
  updateAnt,
  setAnt,
  deleteAnt,
  clearAnts
};


