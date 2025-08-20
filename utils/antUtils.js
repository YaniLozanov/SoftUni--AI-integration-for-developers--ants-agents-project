import { DEFAULT_ANT_NAMES } from '../config/config.js';

/**
 * Returns the next available ant name that is not already in use.
 *
 * Selection order:
 * 1) First unused name from the provided candidates (defaults to DEFAULT_ANT_NAMES)
 * 2) Fallback to sequential names using the given prefix (e.g., "Ant 1", "Ant 2", ...)
 *
 * @param {Iterable<string>} existingNamesIterable - Collection of names currently in use.
 * @param {string[]} [candidates=DEFAULT_ANT_NAMES] - Preferred candidate names to try first.
 * @param {string} [prefix='Ant'] - Prefix for the sequential fallback naming strategy.
 * @returns {string} The next available unique name.
 */
export function getNextAntName(existingNamesIterable, candidates = DEFAULT_ANT_NAMES, prefix = 'Ant') {
  const existingNames = new Set(existingNamesIterable || []);

  if (Array.isArray(candidates)) {
    for (const candidate of candidates) {
      if (!existingNames.has(candidate)) return candidate;
    }
  }

  // Fallback: generate a sequential unique name using the prefix
  let index = (existingNames.size || 0) + 1;
  let candidate = `${prefix} ${index}`;
  while (existingNames.has(candidate)) {
    index += 1;
    candidate = `${prefix} ${index}`;
  }
  return candidate;
}

/**
 * Generates a random Top-p value within a range.
 * Defaults to [0.05, 1.0] rounded to 2 decimals.
 *
 * @param {number} [min=0.05]
 * @param {number} [max=1]
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function generateRandomTopP(min = 0.05, max = 1, decimals = 2) {
  const clampedMin = Math.max(0, Math.min(min, max));
  const clampedMax = Math.min(1, Math.max(min, max));
  const value = Math.random() * (clampedMax - clampedMin) + clampedMin;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Generates a random Temperature value within a range.
 * Defaults to [0.2, 2.0] rounded to 2 decimals.
 *
 * Note: name intentionally follows the requested identifier `generateRandmTemperature`.
 *
 * @param {number} [min=0.2]
 * @param {number} [max=2]
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function generateRandmTemperature(min = 0.2, max = 2, decimals = 2) {
  const clampedMin = Math.max(0, Math.min(min, max));
  const clampedMax = Math.max(min, max);
  const value = Math.random() * (clampedMax - clampedMin) + clampedMin;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export default { getNextAntName, generateRandomTopP, generateRandmTemperature };


