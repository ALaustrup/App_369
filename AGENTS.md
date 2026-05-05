# AGENTS.md

## Cursor Cloud specific instructions

### Overview

**App_369 / ASTRA MATRIX** is an interactive narrative text-adventure game with two interfaces sharing the same core engine (`src/core/SceneEngine.js`):

- **CLI mode** (`npm start` → `node src/cli/index.js`): Terminal-based game using `chalk` and `readline-sync`
- **GUI mode** (`npm run gui` → `expo start`): React Native / Expo web/mobile app

### Environment

- **Runtime:** Node.js v20 (install via nvm: `nvm install 20 && nvm use 20`)
- **Package manager:** npm (lockfile: `package-lock.json`)
- **No test suite or linter is configured** — `npm test` just echoes an error and exits. No ESLint/Prettier configs exist.

### Running the app

- **CLI mode:** `npm start` — interactive terminal game; requires TTY input (`readline-sync`). In headless/CI environments, run inside tmux and use `send-keys` to provide input.
- **GUI/Web mode:** `npx expo start --web --port 8081` — starts Expo dev server. The `public/index.html` landing page is served at the root. The React Native Web build loads alongside it. The React Native DevTools error about `--no-sandbox` when running as root is non-blocking and can be ignored.

### External API keys (optional)

- `GEMINI_API_KEY` — required only for AI-generated free-form narrative input scenes (Google Gemini 1.5 Flash). Pre-defined scene choices work without it.
- GitHub personal access token — only needed for GitHub sync/progress features. Game runs fully without it.

### Gotchas

- The CLI uses `readline-sync` (synchronous blocking I/O). It cannot be tested non-interactively without tmux `send-keys` or similar.
- `.expo/` directory is generated at runtime but is not in `.gitignore`. It is safe to ignore or delete.
- No database or external services are required to run the core game loop.
