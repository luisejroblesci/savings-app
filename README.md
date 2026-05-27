# Savings App — Spending Tracker

A minimalistic React web application for tracking spending with categories, amounts, and notes.

[![CI](https://github.com/luisejroblesci/savings-app/actions/workflows/ci.yml/badge.svg)](https://github.com/luisejroblesci/savings-app/actions/workflows/ci.yml)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/luisejroblesci/savings-app/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/luisejroblesci/savings-app/tree/main)

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Development Workflow](#development-workflow)
- [Usage](#usage)
- [Contributing](#contributing)

---

## Features

### Current Features

- **Add Spending** — Record expenses with category, amount, currency, and optional notes
- **Categories** — Choose from General, Personal, Auto, or House
- **Currency Support** — Toggle between MXN and USD
- **Notes** — Add optional notes (max 140 characters)
- **Spending List** — View all recorded expenses
- **Category Filtering** — Filter expenses by category with per-category totals

### Planned Features

The following features have test coverage written in advance but are not yet implemented:

- Delete and edit existing expenses
- Data persistence via localStorage
- Full-text search through expense notes
- Monthly budget limits with warnings
- CSV import/export
- Full keyboard navigation and screen reader support
- Offline support
- Spanish localization
- Virtualized list rendering for large datasets

---

## Prerequisites

- **Node.js** 18.x or 20.x
- **npm** 9.x or later (bundled with Node.js)

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with the Vitest browser UI |
| `npm run test:coverage` | Generate a test coverage report |

> **Note:** `npm test` runs in interactive watch mode. For a single CI-style run, use `npm test -- --run`.

---

## Testing

This project uses **Vitest** and **React Testing Library**.

### Passing Tests

- Component rendering and form interactions
- Input validation and state management
- Currency toggling and category selection
- Spending list display and filtering

### Failing Tests (By Design)

Files matching `*.failing.test.jsx` contain tests written as specifications for planned features. They are expected to fail until those features are implemented.

```bash
# Run all tests (includes intentionally failing ones)
npm test -- --run

# Run only the currently passing tests
npm test -- --run src/App.test.jsx

# Generate a coverage report
npm run test:coverage -- --run
```

---

## CI/CD

This project uses two CI pipelines:

### GitHub Actions (`.github/workflows/ci.yml`)

- Runs on every push and pull request to `main` and `develop`
- Tests against Node.js 18.x and 20.x in parallel
- Builds the application to verify no compilation errors
- Uploads build artifacts (retained 7 days)
- Generates and uploads test coverage to Codecov
- Audits packages for known vulnerabilities

### CircleCI (`.circleci/config.yml`)

- `test-node` — installs dependencies and runs the test suite
- `build-node` — runs after tests pass, builds the app and stores artifacts
- Workflow: `build-and-test`

---

## Project Structure

```
src/
├── App.jsx                     # Main application component
├── App.test.jsx                # Tests for current functionality
├── App.failing.test.jsx        # Spec tests for planned features
├── EdgeCases.failing.test.jsx  # Edge-case specs for planned features
├── main.jsx                    # Application entry point
└── test/
    └── setup.js               # Vitest/jsdom test configuration
```

---

## Technologies

| Layer | Tool |
|-------|------|
| Frontend | React 18, Vite 5 |
| Styling | Vanilla CSS |
| Testing | Vitest, React Testing Library, @testing-library/jest-dom |
| CI/CD | GitHub Actions, CircleCI |

---

## Development Workflow

This project follows a test-driven approach for new features:

1. Read the failing tests in `*.failing.test.jsx` to understand the requirements
2. Implement the feature until those tests pass
3. Verify all previously passing tests still pass
4. Push — both CI pipelines will run automatically

---

## Usage

1. Select a category from the dropdown (General, Personal, Auto, House)
2. Enter the amount — the `$` symbol is added automatically
3. Toggle the currency between MXN and USD
4. Optionally add a note (up to 140 characters)
5. Click **Add Spending** to save the entry
6. View your full spending list below the form
7. Use the category filter to see totals for a specific category

---

## Contributing

1. Review the failing tests to understand what a feature should do
2. Implement the feature following the test specifications
3. Confirm all existing passing tests still pass: `npm test -- --run src/App.test.jsx`
4. Open a pull request — both CI pipelines run automatically on PRs
