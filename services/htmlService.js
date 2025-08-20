import { getAnts } from '../stores/antsStore.js';
import antService from './antService.js';
import { AVAILABLE_MODELS, OPEN_AI_CONFIG } from '../config/config.js';

function toFixed2(value) {
  const num = Number(value);
  if (Number.isFinite(num)) return num.toFixed(2);
  return String(value ?? '');
}

function escapeHtml(unsafe) {
  return String(unsafe ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Very small markdown formatter supporting **bold** and lines starting with ##
function formatMarkdownLite(input) {
  const escaped = escapeHtml(input);
  const lines = escaped.split(/\r?\n/);
  const htmlLines = lines.map((line) => {
    // Headings: lines beginning with ##
    const headingMatch = line.match(/^##\s+(.*)$/);
    let formatted = headingMatch ? `<h3>${headingMatch[1]}</h3>` : line;
    // Bold: **text**
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return formatted;
  });
  return htmlLines.join('<br/>');
}

function createAntRow(ant) {
  const row = document.createElement('div');
  row.className = 'ant-row';
  row.dataset.id = ant.id;

  const nameInput = document.createElement('input');
  nameInput.className = 'ant-name-input';
  nameInput.type = 'text';
  nameInput.value = ant.name;
  nameInput.addEventListener('change', () => {
    antService.updateAnt(ant.id, { name: nameInput.value });
  });

  const modelSelect = document.createElement('select');
  modelSelect.className = 'model-select';
  const models = Array.isArray(AVAILABLE_MODELS) && AVAILABLE_MODELS.length > 0
    ? AVAILABLE_MODELS
    : [OPEN_AI_CONFIG.model];
  models.forEach(model => {
    const opt = document.createElement('option');
    opt.value = model;
    opt.textContent = model;
    if (model === ant.model) opt.selected = true;
    modelSelect.appendChild(opt);
  });
  modelSelect.addEventListener('change', () => {
    antService.updateAnt(ant.id, { model: modelSelect.value });
  });

  const checkboxContainer = document.createElement('div');
  checkboxContainer.className = 'checkbox-container';
  const checkboxId = `rand-${ant.id}`;
  const randomCheckbox = document.createElement('input');
  randomCheckbox.type = 'checkbox';
  randomCheckbox.className = 'custom-checkbox';
  randomCheckbox.id = checkboxId;
  randomCheckbox.checked = true;
  const randomLabel = document.createElement('label');
  randomLabel.className = 'checkbox-label';
  randomLabel.setAttribute('for', checkboxId);
  randomLabel.textContent = 'Random';
  checkboxContainer.appendChild(randomCheckbox);
  checkboxContainer.appendChild(randomLabel);

  const temperatureContainer = document.createElement('div');
  temperatureContainer.className = 'param-container';
  const temperatureLabel = document.createElement('div');
  temperatureLabel.className = 'param-label';
  temperatureLabel.textContent = 'Temperature';
  const temperatureInput = document.createElement('input');
  temperatureInput.className = 'param-input';
  temperatureInput.type = 'number';
  temperatureInput.step = '0.01';
  temperatureInput.min = '0';
  temperatureInput.max = '2';
  temperatureInput.value = toFixed2(ant.temperature);
  temperatureInput.disabled = true;
  temperatureInput.addEventListener('change', () => {
    antService.updateAnt(ant.id, { temperature: temperatureInput.value });
  });
  temperatureContainer.appendChild(temperatureLabel);
  temperatureContainer.appendChild(temperatureInput);

  const topPContainer = document.createElement('div');
  topPContainer.className = 'param-container';
  const topPLabel = document.createElement('div');
  topPLabel.className = 'param-label';
  topPLabel.textContent = 'Top-p';
  const topPInput = document.createElement('input');
  topPInput.className = 'param-input';
  topPInput.type = 'number';
  topPInput.step = '0.01';
  topPInput.min = '0';
  topPInput.max = '1';
  topPInput.value = toFixed2(ant.topP);
  topPInput.disabled = true;
  topPInput.addEventListener('change', () => {
    antService.updateAnt(ant.id, { topP: topPInput.value });
  });
  topPContainer.appendChild(topPLabel);
  topPContainer.appendChild(topPInput);

  randomCheckbox.addEventListener('change', () => {
    const disabled = randomCheckbox.checked;
    temperatureInput.disabled = disabled;
    topPInput.disabled = disabled;
  });

  row.appendChild(nameInput);
  row.appendChild(modelSelect);
  row.appendChild(checkboxContainer);
  row.appendChild(temperatureContainer);
  row.appendChild(topPContainer);
  return row;
}

export function renderAntsList() {
  const listEl = document.getElementById('antsList');
  if (!listEl) return;
  listEl.innerHTML = '';
  const ants = getAnts();
  ants.forEach(ant => listEl.appendChild(createAntRow(ant)));
}

export function appendUserMessage(text) {
  const chat = document.getElementById('chatArea');
  if (!chat) return;
  const msg = document.createElement('div');
  msg.className = 'message user';
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

export function appendAssistantMessage(text) {
  const chat = document.getElementById('chatArea');
  if (!chat) return;
  const msg = document.createElement('div');
  msg.className = 'message assistant';
  msg.innerHTML = formatMarkdownLite(text);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

export function appendToolNotice(name, args) {
  const chat = document.getElementById('chatArea');
  if (!chat) return;
  const msg = document.createElement('div');
  msg.className = 'message assistant';
  msg.textContent = `The ${name} activated...`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

let loadingEl = null;
export function setChatLoading(loading) {
  const chat = document.getElementById('chatArea');
  if (!chat) return;
  if (loading) {
    if (!loadingEl) {
      loadingEl = document.createElement('div');
      loadingEl.className = 'loading';
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      const text = document.createElement('span');
      text.textContent = 'Thinking...';
      loadingEl.appendChild(spinner);
      loadingEl.appendChild(text);
    }
    chat.appendChild(loadingEl);
    chat.scrollTop = chat.scrollHeight;
  } else if (loadingEl && loadingEl.parentElement) {
    loadingEl.parentElement.removeChild(loadingEl);
  }
}

export function appendResponseCard({ name, model, text }) {
  const list = document.getElementById('responsesList');
  if (!list) return;

  const card = document.createElement('div');
  card.className = 'response-card';

  const header = document.createElement('div');
  header.className = 'response-header';

  const antName = document.createElement('div');
  antName.className = 'response-ant-name';
  antName.textContent = name || 'Ant';

  const modelTag = document.createElement('div');
  modelTag.className = 'response-model';
  modelTag.textContent = model || '';

  header.appendChild(antName);
  header.appendChild(modelTag);

  const content = document.createElement('div');
  content.className = 'response-content';
  content.innerHTML = formatMarkdownLite(text || '');

  card.appendChild(header);
  card.appendChild(content);
  list.appendChild(card);
}

export function renderResponses(results = []) {
  const list = document.getElementById('responsesList');
  if (!list) return;
  list.innerHTML = '';
  results.forEach(r => appendResponseCard(r));
}

export default { renderAntsList, appendResponseCard, renderResponses };


