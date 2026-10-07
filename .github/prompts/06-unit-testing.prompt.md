# Test Case Writing Prompt for React Components

## Purpose
Write unit and integration tests for React components using **React Testing Library (RTL)** and **Vitest**, including mocking APIs and simulating user interactions.

---

## Instructions

Please analyze the provided component or module and generate test cases with the following guidelines:

### General Guidelines
- Use `@testing-library/react` and `@testing-library/jest-dom` for DOM testing.
- Use `vi.fn()` or `vi.mock()` to mock props, API modules, services, or hooks.
- Cover both happy and edge cases.
- Ensure accessibility-focused queries (e.g., `getByRole`, `getByLabelText`) over `getByTestId`.
- Include necessary setup/teardown logic.
- Use `act()` or `waitFor()` where needed to handle async effects (e.g., API calls, state updates).
- Prefer `userEvent` over `fireEvent` for realistic interaction simulation.

---

## Test Scenarios to Cover

### Component Functionality
- Renders correctly with default props
- Handles prop changes dynamically
- Displays error or loading state if applicable
- Handles user interactions (button clicks, form input, selection, etc.)
- Validates required field behavior or input rules

### Mock API Interaction
- Mock service/API using `vi.mock()` (if applicable)
- Simulate API success and error states
- Assert loading spinners, response data rendering, and fallback UIs

### Conditional/UI Logic
- Render variations (e.g., loading vs error vs success views)
- Conditional rendering based on props, state, or external data

### Code Coverage
- Target 80–90% line and branch coverage
- Focus on rendering logic, event handling, and side effects
- Snapshot tests only if component is static and stable
