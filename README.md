# Playwright UI Tests

Simple Playwright test suite for Glints signup page validations.

## Project structure
- `playwright.config.js` — Playwright configuration (HTML reporter).
- `tests/` — Playwright test files (e.g., `tests/signup`).
- `index.js` — small project script.
- `playwright-report/` — generated HTML report output.

## Requirements
- Node.js (LTS)
- npm
- Windows 10/11

## Setup
```powershell
# install dependencies
npm install

# install Playwright browsers
npx playwright install
```