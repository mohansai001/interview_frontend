---
tools: []
description: "Enforce formatting, linting, and code quality standards using Prettier and ESLint."
---

# Code Quality & Formatting Standards

This prompt enforces consistent formatting, linting, and overall code quality standards across the repository.

---

## 1️⃣ Formatting Rules (Prettier)

- Apply Prettier formatting to all files using project-level configuration.
- Fix inconsistent indentation, spacing, and semicolons.
- Enforce:
  - Trailing commas
  - 100 character line limit
  - Single quotes
- Ensure formatting does not change application logic.
- Support Tailwind CSS class sorting via Prettier plugin.
- Integrate Prettier with ESLint.
- Enable format on save in VS Code.

---

## 2️⃣ Linting Rules (ESLint)

- Avoid unused imports or variables.
- Prevent common anti-patterns and potential bugs.
- Ensure proper error handling and exception management.
- Promote readability and maintainability.
- Suggest performance improvements where appropriate.
- Flag security vulnerabilities or insecure coding practices.
- Follow project ESLint configuration strictly.

---

## General Enforcement

- Do not alter business logic unless required to fix lint errors.
- Maintain existing architecture.
- Prioritize safe, non-breaking improvements.
- Ensure the codebase remains clean, consistent, and production-ready.
- Do not generate new configuration files or documentation files.
- Only modify existing source files to apply formatting and linting fixes.

