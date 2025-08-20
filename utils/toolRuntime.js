// Centralized tool runtime: handlers and helpers for executing Claude tool calls.

export const toolHandlers = {
  greetings: (args) => {
    console.log('Tool called');
    if (args && args.message) {
      console.log(String(args.message));
    }
  },
  activate_swarm: async ({ problem }) => {
    const { activateSwarm } = await import('../services/swarmService.js');
    const { sendSwarmSynthesis } = await import('../services/chatService.js');
    const results = await activateSwarm(problem);
    console.log('Swarm aggregation complete:', results);

    // Build a single message for Claude that includes instructions and ant results
    const lines = [
      '## Task',
      'Synthesize a single, coherent solution to the problem using the agents\' responses below. Provide a structured, step-by-step plan and any key trade-offs. Keep it concise and actionable.',
      '',
      '## Problem',
      String(problem || ''),
      '',
      '## Agent Responses'
    ];
    for (const r of results) {
      lines.push(`**${r.name} (${r.model})**: ${r.text}`);
    }

    const message = lines.join('\n');
    await sendSwarmSynthesis(problem, results);
  }
};

export function handleToolCall(name, args) {
  const handler = toolHandlers[name];
  if (typeof handler === 'function') {
    try {
      handler(args);
    } catch (e) {
      console.error('Tool handler error:', e);
    }
  }
}

export default { toolHandlers, handleToolCall };


