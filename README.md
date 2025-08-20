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

### Contributing  

This repository is part of our **SoftUni course – AI Integration for Developers**.  
The main idea: you already have a working foundation, but the real challenge is to **push it further**.  

If you are one of my students, here’s how you can contribute:  

1. **Fork this repo** to your own GitHub account.  
2. **Create a branch** for your feature or fix (e.g. `feature/new-agent` or `fix/ui-bug`).  
3. **Make your changes** – try to keep them small and meaningful.  
4. **Open a Pull Request** back to this repository with a clear description of what you did and why.  

### What kind of contributions are welcome?  
- New types of agents (different strategies / behaviors).  
- Improvements to the simulation logic.  
- Enhancements to the UI (make it easier to visualize or interact with).  
- Refactoring and cleanup – code should be readable and maintainable.  
- Documentation – explain how your part works so others can build on top of it.  

### Rules of the game  
- Small, incremental improvements are better than “big bang” rewrites.  
- Document your thought process – show me *why* you made a change, not just *what* you changed.  
- Respect your peers’ work. If you think something should be changed, explain it in the Pull Request.  

This project is **yours to grow**. Treat it as an open playground: experiment, break things (carefully), and most importantly – learn by doing.  


### License
MIT
