---
applyTo: '**'
---

# ValueMomentum HR Onboarding Frontend - AI Coding Instructions

Apply the `./instructions/a11y.instructions.md`, `./instructions/code-review.instructions.md`, and `./instructions/reactjs.instructions.md` instructions.

## Quick Architecture Overview

**Stack**: React 18 + React Router 6 + Context API + Tailwind CSS + DOMPurify

**Key Architectural Pattern**:

- **Multi-role Application** with 3 user types (candidate, hr, tag) each with distinct feature sets
- **Context-first State Management**: Global state via `AppContext` (user/form/domain data), `ToastContext` (notifications), and `LoadingContext` (async states) - all persisted to localStorage
- **Mock Backend Fallback**: FastAPI backend integration with complete localStorage fallback when offline (see `src/utils/api.js`)
- **Azure AD Integration**: Login redirects to Microsoft with base64-encoded state `{role, location, org}` for callback handling
- **Feature-based Organization**: Components grouped by feature folder (Auth, Dashboard, Forms, HR, TAG, Documents, etc.)

## Critical Patterns You Must Follow

### 1. Context Usage (See `src/context/` files)

- **useApp()** provides `formData`, `userInfo`, `candidates`, `userRole`, `organization`, `updateFormData()`, `logAction()`
- **useToast()** provides `showToast(message, type)` for notifications
- **useLoading()** provides `setLoading(bool)` for overlay spinners
- Always wrap with try/catch when calling API functions; use `showToast()` for errors
- All state changes persist to localStorage automatically via useEffect

**Example**:

```javascript
const { formData, updateFormData } = useApp();
const { showToast } = useToast();
try {
  const result = await api.submitForm(formData);
  showToast('Form submitted', 'success');
} catch (err) {
  showToast(err.message || 'Error occurred', 'error');
}
```

### 2. API Integration Pattern (`src/utils/api.js`)

- All API calls go through the `api` object (centralized layer)
- Each endpoint includes built-in localStorage fallback for offline mode
- Key endpoints: `api.login()`, `api.submitForm()`, `api.uploadDocument()`, `api.validateDocument()`
- Never make fetch() calls directly; always use the `api` utility
- Responses auto-sanitize with DOMPurify; backend data is considered untrusted

### 3. Component Structure & Comments

Add JSDoc block at top of EVERY component file explaining:

- **Purpose**: One-liner about the component's role
- **Props**: List each prop with type and description
- **Context Used**: Which context hooks it consumes
- **Key Behavior**: Notable side effects, validations, or business logic
- **Accessibility**: Any ARIA attributes or keyboard patterns used

**Example**:

```javascript
/**
 * OnboardingForm.js - Multi-step form for candidate onboarding
 *
 * Purpose: Captures and validates employment details, personal info, and documents
 * for new hires (candidate role only).
 *
 * Props: None (reads from AppContext)
 * Context: useApp (formData, updateFormData), useToast, useLoading
 * Key Behavior: Auto-saves to localStorage on every field change; shows validation
 * errors inline; enforces role-based field visibility
 *
 * Accessibility: Keyboard nav, form labels with aria-required, error messages
 * linked via aria-describedby
 */
```

### 4. Role-Based Route Protection

- Routes defined in `src/routes/index.js` with `HR_ONLY_ROUTES`, `CANDIDATE_ROUTES`, `ALUMNI_ROUTES`
- MainLayout (in `src/components/Layout/MainLayout.js`) enforces role-based rendering:
  - Candidates see: Dashboard, Onboarding Form, Documents, Validation, Support
  - HR/TAG see: HRReview, RegisterCandidate, CandidateDetail, etc.
  - Alumni see: AlumniDashboard (no sidebar)
- Check `useApp().userRole` to conditionally render features, NOT `useLocation().pathname`

### 5. Tailwind CSS Configuration

- Theme extends from `src/tailwind.config.js` with brand colors (sky blue palette)
- Use CSS variables (`var(--primary)`, `var(--error)`, `var(--success)`) as fallback for older components
- Global styles in `src/styles/index.css` (Tailwind @imports, CSS var definitions)
- Dark mode toggle stored in localStorage and applied to `<html class="dark">` root
- **Don't mix**: Avoid mixing Tailwind classes with inline styles; consolidate to one approach per component

### 6. Data Flow in Multi-org System

- `organization` field in AppContext determines branding: 'valuemomentum' vs 'owlsure'
- Logo paths, email addresses, and legal docs change based on org; see `MainLayout.js` for pattern
- Location ('india', 'us') affects form field visibility, document requirements, and tax configurations

### 7. Error Handling Pattern

- **Always wrap API calls** in try/catch
- **Show user-friendly toast** via `useToast()` for errors
- **Log to audit trail** via `logAction(action, details)` for compliance
- **Never expose backend errors** to UI; sanitize error messages
- Implement error boundaries in Layout components for unhandled crashes

### 8. Document Management Pattern (`src/components/Documents/`)

- Documents uploaded via drag-drop to AWS/GCS (backend handles upload)
- AI validation runs asynchronously; status stored in `validationHistory` context
- DOMPurify sanitizes all document previews before rendering (XSS prevention)
- Use `api.uploadDocument()` and `api.validateDocument()` functions

### 9. Naming Conventions (See CODING_STANDARDS.md)

- **Components**: PascalCase files (`UserProfile.js`, `HRDashboard.js`)
- **Hooks**: camelCase with 'use' prefix (`useDebounce`, `useFetch`)
- **Utils**: camelCase (`sanitizeData`, `calculateProgress`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `API_BASE_URL`)
- **CSS classes**: kebab-case (`user-profile`, `form-section`)

### 10. Development Workflows

**Start Dev Server**: `npm start` → http://localhost:3000  
**Build for Prod**: `npm run build` → outputs to `build/` folder  
**Test**: `npm test` (uses Jest + React Testing Library)

**Mock Login Credentials** (when backend offline):

- HR: `hr@valuemomentum.com` / `password123`
- TAG: `tag@valuemomentum.com` / `password123`
- Candidate: `john.doe@gmail.com` / `password123`

**Environment Variables** (in `.env`):

- `REACT_APP_API_BASE`: FastAPI backend URL (default: https://hr-onboarding-h9gnfgdgf8a9cbfk.canadacentral-01.azurewebsites.net/api)
- `REACT_APP_DEMO_PASSWORD`: Demo account password
- `REACT_APP_DEFAULT_CANDIDATE_PASSWORD`: Default candidate password

## File Structure Reference

```
src/
├── components/           # UI organized by feature
│   ├── Auth/            # Login, CandidateLogin, OfferAcceptance
│   ├── Layout/          # MainLayout, Header, Sidebar (wraps authenticated routes)
│   ├── Dashboard/       # Role-specific dashboards (Candidate, HR, TAG, Alumni)
│   ├── Forms/           # OnboardingForm (multi-step form)
│   ├── Documents/       # Upload, preview, validation views
│   ├── HR/              # HRReview, CandidateDetail, Exceptions, Workflows
│   ├── TAG/             # OfferLetters, candidate registration
│   ├── UI/              # Reusable: Button, Input, Card, Modal, Toast, etc.
│   └── Validation/      # AI document validation results
├── context/             # React Context providers (3 total)
├── hooks/               # Custom: useDebounce, useFetch
├── utils/               # api.js (centralized API layer), sanitize.js, progress.js, etc.
├── routes/              # ROUTES object with HR_ONLY_ROUTES, etc.
├── styles/              # Global CSS, Tailwind imports, CSS variables
├── constants/           # constants.js with enums/config
└── App.js              # Root component, Auth state, Azure AD callback handler
```

## Special Considerations

- **Zero Backend Dependency**: App works 100% offline using localStorage mock DB
- **Session Timeout**: SessionTimeout component monitors inactivity; auto-logout after 15 mins
- **Audit Logging**: Every significant action logged via `logAction()` for compliance
- **Multi-org Support**: Same codebase serves ValueMomentum and OwlSure; branded dynamically
- **XSS Prevention**: All user/backend data sanitized with DOMPurify before rendering
- **Accessibility First**: WCAG 2.2 AA compliance required; use semantic HTML, ARIA attributes, keyboard nav

## Documentation & Logs

- Add detailed JSDoc comments at top of every component/utility file
- Save chat histories to `logs/<date>-<username>.log.md` for reference
- Reference CODING_STANDARDS.md for detailed style guide
