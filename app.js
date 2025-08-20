import antService from './services/antService.js';
import { renderAntsList } from './services/htmlService.js';
import chatService from './services/chatService.js';

document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('addAntBtn');
  if (addButton) {
    addButton.addEventListener('click', () => {
      antService.createAnt();
      renderAntsList();
    });
  }

  const sendBtn = document.getElementById('sendBtn');
  const chatInput = document.getElementById('chatInput');
  if (sendBtn && chatInput) {
    const send = () => {
      const value = chatInput.value;
      chatInput.value = '';
      chatService.sendMessage(value);
    };
    sendBtn.addEventListener('click', send);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
  }

  // Initial render (in case there are pre-populated ants)
  renderAntsList();
});


