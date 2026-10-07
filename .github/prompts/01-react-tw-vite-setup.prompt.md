# React + TypeScript + TailwindCSS + Vite (Best Practices Setup)

You are an expert React architect. Generate a **production-ready boilerplate project setup** for a **React application using Vite + TypeScript + TailwindCSS**, following **industry best practices** for scalability, linting, formatting, and routing.

IMPORTANT:
Before generating any code, read and strictly follow:
.github/instructions/reactjs.instructions.md

If any conflict exists between this prompt and the instruction file,
prioritize the instruction file.

---

## Requirements

### 1. Folder Structure (Scalable & Maintainable)

```
src/
 ├── assets/           # Static assets (images, icons, fonts)
 ├── components/       # Reusable UI components
 │    └── Navbar.tsx
 ├── pages/            # Page-level components
 │    ├── Home.tsx
 │    ├── About.tsx
 │    └── NotFound.tsx
 ├── layouts/          # Layout components
 │    └── DefaultLayout.tsx
 ├── routes/           # Centralized routing configuration
 │    └── AppRoutes.tsx
 ├── hooks/            # Custom React hooks
 ├── context/          # React Context providers
 ├── services/         # API calls (axios/fetch configs)
 ├── utils/            # Utility functions/helpers
 ├── types/            # TypeScript types/interfaces
 ├── styles/           # Global styles, Tailwind overrides
 │    └── index.css
 ├── main.tsx          # App entry point
 ├── App.tsx           # Root component
 └── vite-env.d.ts     # Vite TypeScript definitions
```

---

### 2. Vite Configuration (`vite.config.ts`)

* Use **TypeScript**
* Add aliases:

  * `@components → ./src/components`
  * `@pages → ./src/pages`
  * `@hooks → ./src/hooks`
  * `@utils → ./src/utils`
* Dev server runs on **port 5173**

---

### 3. ESLint & Prettier

* `.eslintrc.json` → Use Airbnb + React + TypeScript rules
* `prettier.config.js` → Consistent formatting

---

### 4. Tailwind Setup

* Install TailwindCSS + PostCSS + Autoprefixer
* `tailwind.config.js` → Add **custom theme overrides** (colors, fonts)
* `src/styles/index.css` → import Tailwind layers

---

### 5. Routing (react-router-dom v6)

* Basic routes: `/` → Home, `/about` → About
* Use **lazy loading** via `React.lazy` + `Suspense`
* Add a `NotFound` fallback route (`*`)
* Example:

```tsx
const Home = lazy(() => import("@pages/Home"));
const About = lazy(() => import("@pages/About"));
const NotFound = lazy(() => import("@pages/NotFound"));
```

---

### 6. Boilerplate Components

* `Navbar` inside `src/components/`
* `DefaultLayout` wrapping children with Navbar + Footer

---

### 7. Environment Variables

* Create `.env.development` and `.env.production`

Example:

```
VITE_API_URL=https://api.dev.example.com
```

* Access in React with:

```ts
const apiUrl = import.meta.env.VITE_API_URL;
```

Avoid storing secrets in frontend `.env` files.

---

### 8. Best Practices

* Enable **strict mode** in TypeScript
* Use **absolute imports** (via Vite aliases)
* Only **functional components + hooks** (no class components)
* Apply **Husky + lint-staged** for pre-commit formatting/linting
* Enforce Prettier formatting before commits

---

## Deliverables

Generate the following files with working boilerplate code:

1. `vite.config.ts` (with aliases + dev server config)
2. `.eslintrc.json`
3. `prettier.config.js`
4. `tailwind.config.js`
5. `postcss.config.js`
6. `src/styles/index.css`
7. `src/main.tsx`
8. `src/App.tsx`
9. `src/routes/AppRoutes.tsx` (with lazy-loaded routes + 404 fallback)
10. `src/layouts/DefaultLayout.tsx`
11. `src/components/Navbar.tsx`
12. `src/pages/Home.tsx`
13. `src/pages/About.tsx`
14. `src/pages/NotFound.tsx`
15. `.env.development` (sample)
16. `.env.production` (sample)

---

## Instruction

Generate **all code files** listed above in a **single response**, formatted in fenced code blocks with correct filenames as comments.
Example:

```tsx
// src/pages/Home.tsx
export default function Home() {
  return <h1 className="text-2xl font-bold">Home Page</h1>;
}
```

After scaffolding, the project should run successfully with:

```bash
npm install
npm run dev
```

---

Make sure everything is **production-ready** and aligned with **React + TypeScript + Tailwind industry standards**.
