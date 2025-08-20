// Simple in-memory chat store for Claude conversation

export const messages = [];

export function addMessage(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const role = entry.role === 'assistant' ? 'assistant' : 'user';
  const content = String(entry.content ?? '');
  const message = {
    role,
    content,
    timestamp: entry.timestamp || Date.now()
  };
  messages.push(message);
  return message;
}

export function addUserMessage(content) {
  return addMessage({ role: 'user', content });
}

export function addAssistantMessage(content) {
  return addMessage({ role: 'assistant', content });
}

export function getMessages() {
  return messages.slice();
}

export function clearMessages() {
  messages.length = 0;
}

export default {
  messages,
  addMessage,
  addUserMessage,
  addAssistantMessage,
  getMessages,
  clearMessages
};


