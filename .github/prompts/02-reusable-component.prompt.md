## GLOBAL GOVERNANCE RULE

You MUST read and strictly follow the following instruction files:

- .github/instructions/reactjs.instructions.md
- .github/instructions/a11y.instructions.md

Apply them BEFORE applying any rules in this file.

If any conflict exists, the instruction files override this prompt.

Do not generate code until both instruction files have been analyzed.

---

## Mandatory Design Token Rules (Non-Negotiable)

- Design tokens are defined in: `src/styles/tokens.css`
- Tokens are exposed as semantic Tailwind utility classes
- Components MUST use ONLY token-based utilities

NEVER use Tailwind default utilities such as:
- bg-blue-*, bg-red-*, text-gray-*
- p-4, px-6, py-2, m-4
- rounded-lg, rounded-xl
- shadow-md, shadow-lg
- text-sm, text-base

ALWAYS use semantic token utilities:
- Colors → bg-primary, text-primary-foreground, bg-danger
- Spacing → px-control-md, py-control-md
- Radius → rounded-control
- Typography → text-body-md, font-body-medium
- Motion → transition-motion-fast

## Mandatory Component File Structure (Non-Negotiable)

When generating a reusable component, ALWAYS follow this exact structure:

src/components/<ComponentName>/
├── <ComponentName>.tsx
├── <ComponentName>.stories.tsx
└── index.ts

Rules:
  * <ComponentName> MUST be PascalCase
  * Component implementation MUST live in `<ComponentName>.tsx`
  * Storybook stories MUST live in `<ComponentName>.stories.tsx`
  * `index.ts` MUST export the component
  * No additional files are allowed

## Output Restrictions (Very Important)

The generator MUST output ONLY the following files:

1. `<ComponentName>.tsx`
2. `<ComponentName>.stories.tsx`
3. `index.ts`

STRICT RULES:
  * Do NOT generate `.md` files
  * Do NOT generate documentation files
  * Do NOT generate README content
  * Do NOT include explanations or comments outside code
  * Do NOT describe the component in text

Output ONLY valid TypeScript / TSX code for the required files

## General Guidelines for Common Components

1. **Reusability First**

   * Components must be generic enough to be reused across pages.
   * Avoid hardcoding strings, labels, or API endpoints.

2. **TypeScript Typing**

   * Always use **explicit props interfaces**.
   * Avoid using `any` – prefer `unknown`, `string`, `number`, `boolean`, or generics.

3. **Props Management**

   * Accept only **necessary props**.
   * Provide **sensible defaults** using `defaultProps` or default values in destructuring.

4. **Styling**

    * Use **TailwindCSS utility classes mapped to design tokens**
    * Tokens MUST come from `src/styles/tokens.css`
    * Allow overriding styles via a `className` prop
    * Do NOT use Tailwind default color, spacing, radius, shadow, or typography utilities
    * Do NOT inline hardcoded styles
    * If a required token does not exist:
      * Do NOT invent a class
      * Add a TODO comment to update `tokens.css`
    * Don't declare anything if it is not being used in the component

5. **Accessibility (a11y)**

   * Use semantic HTML (`button`, `label`, `input`, etc.).
   * Add `aria-*` attributes where needed.
   * Ensure keyboard navigation (e.g., `tabIndex`, `onKeyDown`).

6. **Error Boundaries & Guards**

   * Validate props before rendering (e.g., don’t render an image if `src` is empty).
   * Use **fallback UI** where applicable.

---

## Common Props to Support

Every **common component** should, where applicable, support:

* `children?: React.ReactNode` → for nested content.
* `className?: string` → to extend styling.
* `id?: string` → for DOM targeting.
* `name?: string` → for DOM targeting.
* `value?: "string" | "Object" | "number"` → for value display.
* `onClick?: () => void` → if clickable.
* `disabled?: boolean` → for buttons/inputs.
* `variant?: "primary" | "secondary" | "danger" | "link"` → for design system variants.
* `size?: "sm" | "md" | "lg"` → for consistent sizing.

---

## Props & Practices to Avoid

* Avoid passing **inline style objects** (`style={{ ... }}`) unless dynamic runtime styling is required.
* Avoid **boolean flags explosion** (e.g., `isPrimary`, `isSecondary`, `isDanger`). Use a single `variant` prop.
* Avoid mixing **business logic** with UI components. (Keep API calls, state mutations outside).
* Avoid props that duplicate existing HTML attributes (e.g., `labelText` instead of using `children`).

---

## stories should be created for each reusable component to demonstrate its usage with different props and variants. This helps ensure that the component is well-documented and easily testable across various scenarios.

## Example Component Template

```tsx
// src/components/Button/Button.tsx
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const baseStyles = `
  rounded-control
  font-body-medium
  transition-motion-normal
`;

// Variant styles should use design tokens from tokens.css

type Variant = "primary" | "secondary" | "danger" | "link";

const variantStyles: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
  danger: "bg-danger text-danger-foreground hover:bg-danger-hover",
  link: "text-link underline hover:text-link-hover",
};

type Size = "sm" | "md" | "lg";

const sizeStyles: Record<Size, string> = {
  sm: "px-control-sm py-control-sm text-body-sm",
  md: "px-control-md py-control-md text-body-md",
  lg: "px-control-lg py-control-lg text-body-lg",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};
```

---

## Guardrails

* All reusable components must:
  * Support **className** prop for style extension.
  * Be **typed** with TypeScript.
  * Be **stateless/pure** unless state is intrinsic (like Modal open/close).
* Use **default variants & sizes** to prevent visual inconsistencies.
* Document props inside the component file (via JSDoc or TS interface).
* Provide fallback rendering for required props (like `alt` text in images).
* Add **unit tests** for critical reusable components (e.g., Button, Input, Modal).

---

## Deliverable

When generating a new component, ensure:

1. It follows the above **prop conventions**.
2. It uses **TailwindCSS** for styling with `className` extendability.
3. It avoids **prop bloat** and uses `variant` / `size` patterns.
4. It is fully typed with TypeScript and safe for reuse across the project.

---

## Design Tokens Reference

This project utilizes `tokens.css` for consistent design values. Here's how to map component props to token values:

- **Colors**: Use `text-{color}` and `bg-{color}` for text and background colors.
- **Spacing**: Utilize `p-{size}`, `m-{size}`, `px-{size}`, `py-{size}` for padding and margin.
- **Font Sizes**: Implement `text-{size}` for consistent font sizing.
- **Border Radius**: Apply `rounded-{size}` for border radius.

### Example

For a button with primary variant and large size:

```tsx
<button
  className="
    bg-primary
    text-primary-foreground
    rounded-control
    px-control-lg
    py-control-lg
    text-body-md
    transition-motion-fast
  "
>
  Click Me
</button>
```

This ensures the button adheres to the design system's primary color, text color, border radius, and padding.

---

## Consistent Token Usage

Always prefer design tokens over hardcoded values. This approach guarantees scalability and maintainability of the design system. For instance, instead of `bg-red-500`, use `bg-error` which maps to the appropriate red shade in `tokens.css`.

---

## Complete List of Design Tokens

Refer to `tokens.css` for the comprehensive list of design tokens available for use in this project. Ensure to keep this file updated as the design system evolves.

---

## Key Improvements:

**Complete token reference** – All design tokens documented with usage
**Zero hardcoded values** – Every example uses only CSS variables
**Comprehensive color palette** – Brand, semantic, neutral, text, background, border colors
**Full spacing system** – 10 spacing tokens for consistent layouts
**Typography system** – 6 font sizes with weight and line-height options
**Control sizing** – 3 standard control heights
**Elevation system** – 5 shadow levels for depth
**Motion tokens** – 3 transition speeds
**Z-index system** – 8 layering levels
**Realistic example** – Button component using only token references
**Pattern templates** – Reusable patterns for variant and size mapping
**Validation checklist** – Comprehensive deliverable verification
**Philosophy section** – Explains design system approach
**Maintenance guidance** – How to evolve tokens over time

## Token Validation Checklist (Must Pass)

Before returning a component, verify:

- [ ] No Tailwind default colors are used
- [ ] No numeric spacing utilities (p-4, px-6, etc.)
- [ ] No rounded-* utilities outside tokens
- [ ] No shadow-* utilities outside tokens
- [ ] All styles map to tokens.css
- [ ] tokens.css is assumed to be globally imported
