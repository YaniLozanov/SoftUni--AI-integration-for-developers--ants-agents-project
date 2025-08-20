import antService from './antService.js';
import requestOpenAI from '../clients/openai.js';
import { renderResponses } from './htmlService.js';

/**
 * Activates the swarm for a given problem statement.
 * Steps:
 * 1) Copy the problem into each ant's prompt
 * 2) Fire async OpenAI calls for each ant
 * 3) Await all responses
 * 4) Console.log the results
 *
 * @param {string} problemText
 * @returns {Promise<Array<{ antId:string, name:string, model:string, text:string }>>}
 */
export async function activateSwarm(problemText) {
  const problem = String(problemText ?? '').trim();
  const ants = antService.getAnts();
  if (!Array.isArray(ants) || ants.length === 0 || !problem) return [];

  const calls = ants.map((ant) => {
    const cfg = {
      model: ant.model,
      topP: ant.topP,
      temperature: ant.temperature,
      systemPrompt: ant.systemPrompt,
      prompt: problem,
      maxOutputTokens: ant.maxOutputTokens
    };
    return requestOpenAI(cfg).then(({ text }) => ({
      antId: ant.id,
      name: ant.name,
      model: ant.model,
      text: text || ''
    }));
  });

  const results = await Promise.all(calls);
  console.log('Swarm results:', results);
  renderResponses(results);
  return results;
}

export default { activateSwarm };


