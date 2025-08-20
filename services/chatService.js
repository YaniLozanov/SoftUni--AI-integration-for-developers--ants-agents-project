import { CLAUDE_CONFIG } from '../config/config.js';
import { requestClaude } from '../clients/claude.js';
import { appendUserMessage, appendAssistantMessage, setChatLoading, appendToolNotice } from './htmlService.js';
import { addUserMessage, addAssistantMessage, getMessages } from '../stores/chatStore.js';
import { handleToolCall } from '../utils/toolRuntime.js';
import { CLAUDE_TOOLS } from '../utils/claudeTools.js';

// Simple in-memory conversation log (optional use later)
export const conversation = [];

export async function sendMessage(text, overrides = {}) {
  const content = String(text ?? '').trim();
  if (!content) return null;

  // UI: add user message and show loading
  appendUserMessage(content);
  addUserMessage(content);
  setChatLoading(true);

  conversation.push({ role: 'user', content });

  try {
    const history = getMessages();
    const cfg = { ...CLAUDE_CONFIG, ...overrides, messages: [...history, { role: 'user', content }], tools: CLAUDE_TOOLS };
    const { text: reply, raw } = await requestClaude(cfg);

    // If Claude requested a tool call, handle it here (simple, single-call example)
    const toolUse = Array.isArray(raw?.content)
      ? raw.content.find(part => part?.type === 'tool_use')
      : null;
    if (toolUse && toolUse.name) {
      appendToolNotice(toolUse.name, toolUse.input);
      handleToolCall(toolUse.name, toolUse.input);

      // Follow-up call to Claude with tool_result to notify completion
      const updatedHistory = getMessages();
      const latestEntry = updatedHistory[updatedHistory.length - 1];
      if (latestEntry && latestEntry.role === 'user' && latestEntry.content !== content) {
        appendUserMessage(latestEntry.content);
      }

      const followupMessages = [
        ...updatedHistory,
        { role: 'assistant', content: raw.content },
        {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: 'Tool completed successfully'
            }
          ]
        }
      ];

      const { text: followupText } = await requestClaude({ ...CLAUDE_CONFIG, ...overrides, messages: followupMessages, tools: CLAUDE_TOOLS });
      if (followupText) {
        appendAssistantMessage(followupText);
        addAssistantMessage(followupText);
      }
    }
    const assistantText = reply || '';
    appendAssistantMessage(assistantText);
    addAssistantMessage(assistantText);
    conversation.push({ role: 'assistant', content: assistantText });
    return { reply: assistantText, raw };
  } catch (err) {
    const message = err?.message || 'Failed to get a response.';
    appendAssistantMessage(`Error: ${message}`);
    return null;
  } finally {
    setChatLoading(false);
  }
}

export async function sendSwarmSynthesis(problem, results) {
  const lines = [
    '## Task',
    'Synthesize a single, coherent solution to the problem using the agents\' responses below. Provide a structured, step-by-step plan and any key trade-offs. Keep it concise and actionable. Do not trigger the tool again.',
    '',
    '## Problem',
    String(problem || ''),
    '',
    '## Agent Responses'
  ];
  (Array.isArray(results) ? results : []).forEach(r => {
    lines.push(`**${r.name} (${r.model})**: ${r.text}`);
  });
  const message = lines.join('\n');
  return sendMessage(message);
}

export default { sendMessage, sendSwarmSynthesis, conversation };


