// Custom tools definition for Claude tool-use.
// Start with a simple greetings tool. Add more tools later as needed.
export const CLAUDE_TOOLS = [
  {
    name: 'greetings',
    description: 'Responds to greetings like "hi" or "hello" and can optionally echo a message.',
    input_schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Optional message to log or respond with.'
        }
      }
    }
  },
  {
    name: 'activate_swarm',
    description: 'Activates the ant swarm to solve a problem statement by parallelizing calls and aggregating results.',
    input_schema: {
      type: 'object',
      properties: {
        problem: {
          type: 'string',
          description: 'The problem description to provide to all ants.'
        }
      },
      required: ['problem']
    }
  }
];

export default { CLAUDE_TOOLS };


