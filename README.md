# Savings App - Spending Tracker

A minimalistic React web application for tracking your spending with categories, amounts, and notes.

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/luisejroblesci/chat/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/luisejroblesci/chat/tree/main)
[![CI](https://github.com/luisejroblesci/savings-app/actions/workflows/ci.yml/badge.svg)](https://github.com/luisejroblesci/savings-app/actions/workflows/ci.yml)

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Scripts](#scripts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [CI/CD](#cicd)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)

## Features

### Available Now

- **Add Spending**: Record expenses with category, amount, currency, and optional notes
- **Categories**: Organize expenses into General, Personal, Auto, or House
- **Currency Support**: Toggle between MXN and USD per entry
- **Notes**: Attach optional notes up to 140 characters
- **Spending List**: View all recorded expenses in one place
- **Category Filtering**: Filter the list by category and see per-category totals

### Planned (Test-Driven Roadmap)

The features below have full test coverage in `*.failing.test.jsx` files and are ready to be implemented:

| Feature | Description |
|---|---|
| Delete / Edit | Modify or remove existing expenses |
| Data Persistence | Save expenses to `localStorage` |
| Search | Find expenses by notes or content |
| Budget Limits | Set monthly budgets with overage warnings |
| CSV Import / Export | Move expense data in and out of the app |
| Accessibility | Full screen reader and keyboard navigation |
| Offline Support | Use the app without an internet connection |
| Multi-language | Spanish (`es`) localization |
| Performance | Virtualized list rendering for large datasets |

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later (bundled with Node.js)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open your browser at `http://localhost:3000`.

## Usage

1. Select a **category** from the dropdown (General, Personal, Auto, House).
2. Enter the **amount** — numbers only; the `$` symbol is added automatically.
3. Toggle the **currency** between MXN and USD.
4. Optionally add a **note** (up to 140 characters).
5. Click **Add Spending** to save the entry.
6. Scroll down to see your **spending list**.
7. Use the **category filter** to narrow the list and see totals per category.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with the Vitest browser UI |
| `npm run test:coverage` | Generate a test coverage report |

## Testing

This project uses **Vitest** and **React Testing Library**. Tests are split into two groups:

### Passing tests

- Component rendering and form interactions
- Input validation and state management
- Currency toggling and category selection
- Spending list display and filtering

### Failing tests (by design)

Files named `*.failing.test.jsx` contain specifications for **future features**. They are expected to fail until the corresponding feature is implemented — treat them as living documentation of the development roadmap.

```bash
# Run all tests (includes the intentionally failing ones)
npm test

# Run only the currently passing tests
npm test -- src/App.test.jsx

# Generate a coverage report
npm run test:coverage
```

## Project Structure

```
savings-app/
├── index.html
├── vite.config.js
├── package.json
├── .circleci/
│   └── config.yml              # CircleCI pipeline configuration
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions workflow
└── src/
    ├── main.jsx                # Application entry point
    ├── App.jsx                 # Main application component
    ├── App.test.jsx            # Passing tests for current functionality
    ├── App.failing.test.jsx    # Failing tests for future features
    ├── EdgeCases.failing.test.jsx # Advanced feature specifications
    └── test/
        └── setup.js           # Test environment configuration
```

## Technologies Used

| Layer | Technology |
|---|---|
| UI framework | React 18 |
| Build tool | Vite 5 |
| Styling | Vanilla CSS (no external framework) |
| Testing framework | Vitest |
| Component testing | React Testing Library, `@testing-library/jest-dom` |
| CI/CD | CircleCI, GitHub Actions |

## CI/CD

The project runs automated pipelines on every push and pull request.

**CircleCI** (`/.circleci/config.yml`):
- Installs dependencies and runs the test suite (`test-node` job)
- Builds the application and stores build artifacts (`build-node` job)
- The build job runs only after tests pass

**GitHub Actions** (`/.github/workflows/ci.yml`):
- Parallel test and build checks triggered on push/PR

## Development Workflow

This project follows a **Test-Driven Development** approach for new features:

1. Read the failing tests in `*.failing.test.jsx` to understand the feature requirements.
2. Implement the feature in `App.jsx` (or new components as needed).
3. Verify the previously failing tests now pass and no existing tests regress.
4. Push — CI will run the full test suite and build automatically.

## Contributing

1. Review the failing tests to understand what needs to be built.
2. Implement the feature following the test specifications.
3. Confirm all existing passing tests remain green.
4. Open a pull request — CI will validate tests and the build.
