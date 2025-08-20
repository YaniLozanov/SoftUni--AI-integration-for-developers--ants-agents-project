## SoftUni - AI Integration for Developers - Ants Agents Project

A minimal, browser-first project demonstrating multi-agent style prompts ("ants") that call OpenAI and Anthropic APIs from a simple frontend. No server required; keys are supplied at runtime.

### Structure
```
Live/
  app.js
  index.html
  styles/main.css

  config/config.js
  config/keys.js

  clients/openai.js
  clients/claude.js

  models/Ant.js

  services/antService.js
  services/chatService.js
  services/htmlService.js
  services/swarmService.js

  stores/antsStore.js
  stores/chatStore.js

  utils/antUtils.js
  utils/claudeTools.js
  utils/toolRuntime.js
```

### Setup keys (no hardcoding)
- In browser DevTools:
```js
localStorage.setItem('OPENAI_API_KEY', 'sk-...');
localStorage.setItem('ANTHROPIC_API_KEY', 'anthropic-...');
```
- Or globals:
```js
window.OPENAI_API_KEY = 'sk-...';
window.ANTHROPIC_API_KEY = 'anthropic-...';
```
- Or env vars when serving/bundling: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`.

`config/keys.js` reads from `window`, `localStorage`, then `process.env`.

### Run locally
- Open `Live/index.html` directly, or serve `Live/` with a static server.

### Change defaults
- Models/params: `config/config.js`
- OpenAI client: `clients/openai.js`
- Anthropic client: `clients/claude.js`

### Security
- Never commit real API keys. Rotate any exposed keys immediately.

### License
MIT
