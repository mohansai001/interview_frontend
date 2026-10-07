## Prompt: Convert Figma Design to React Code (with Tailwind CSS)

You are a senior frontend engineer. Convert the selected Figma frame into a production-ready React component using functional components and Tailwind CSS. Follow these best practices:

- Pixel-perfect layout as per Figma spacing, padding, color, font, and layout specs.
- Use Tailwind utility classes for styling (no inline styles or custom CSS unless necessary).
- Structure the layout using `div`, `section`, or `main` appropriately.
- Use semantic HTML wherever applicable (e.g., `<header>`, `<footer>`, `<nav>`, `<button>`).
- Component should be accessible (ARIA attributes, labels, keyboard navigation where relevant).
- Extract reusable parts into smaller sub-components if the design contains repeated patterns.
- Maintain responsiveness (use Tailwind responsive breakpoints like `sm:`, `md:`, etc.).
- Add placeholder content where real data is not available.
- Do not hardcode values; use descriptive names for props when relevant.
- Add types (use TypeScript if the project supports it).
- DO NOT use fixed pixel (`px`) widths or heights unless absolutely necessary (like icon sizes).
- Use responsive and relative Tailwind CSS classes:
  - Use `w-full`, `h-auto`, `max-w-`, `min-h-screen` for layout.
  - Use `gap`, `space-x`, `space-y`, `padding`, and `margin` using Tailwind scale (`p-4`, `mt-6`, etc.).
  - Use media query prefixes (`sm:`, `md:`, `lg:`, `xl:`) for breakpoint-specific layout changes.
- Layout must **scale across devices** — desktop, tablet, mobile.
- Structure the layout using `flex`, `grid`, `wrap`, and responsive columns (`grid-cols-1 sm:grid-cols-2`).
- For typography and spacing, use Tailwind’s utility classes (`text-base`, `text-lg`, `leading-tight`, etc.).
- Use semantic HTML5 structure with accessibility in mind.