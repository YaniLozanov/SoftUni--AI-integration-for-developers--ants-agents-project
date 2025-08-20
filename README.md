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

### Architecture
- UI layer: `index.html`, `styles/main.css`, `app.js` render the interface and wire user actions (with helpers from `services/htmlService.js`).
- State layer: `stores/antsStore.js` and `stores/chatStore.js` hold app state (ants configuration and chat history/results).
- Domain model: `models/Ant.js` defines the shape and defaults for an individual "ant" (agent config).
- Services:
  - `services/chatService.js`: orchestrates chat runs, reads/writes stores, updates the UI.
  - `services/swarmService.js`: executes model calls for multiple ants in parallel and returns structured results.
  - `services/antService.js`: create/update ant definitions.
  - `services/htmlService.js`: DOM utilities used by the UI layer.
- API clients:
  - `clients/openai.js`: minimal wrapper around OpenAI Chat Completions API.
  - `clients/claude.js`: minimal wrapper around Anthropic Messages API, optionally using tools from `utils/claudeTools.js`.
- Configuration: `config/config.js` holds model defaults; `config/keys.js` resolves API keys from `window`, `localStorage`, or `process.env`.
- Utilities: `utils/*` includes helpers and example tool definitions for Claude.

#### Data flow
1. User configures ants in the UI → `antsStore` is updated.
2. User submits a prompt → `chatService` builds per-ant requests from stores and defaults.
3. `swarmService` runs each ant's request in parallel via the relevant client (`openai`/`claude`).
4. Responses are written to `chatStore` and rendered by the UI.

#### Notes
- Parallelism uses `Promise.all` in the browser; be mindful of provider rate limits.
- Adjust defaults (models, temperature, topP, tokens) in `config/config.js`.
- Secrets are not committed; keys must be supplied at runtime.

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
