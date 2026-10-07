# Security Review Prompt for React Application

## Purpose
Perform a thorough **security review** of the React application codebase. This includes identifying common vulnerabilities, insecure patterns, and suggesting improvements in line with best practices (OWASP Top 10, Secure Coding Guidelines, etc.).

---

## Instructions
Please review the React project code and provide feedback on **security-related risks**. Specifically:

1. Detect common vulnerabilities in React apps:
   - Cross-Site Scripting (XSS)
   - Cross-Site Request Forgery (CSRF)
   - Insecure API usage
   - Unvalidated user inputs
   - Insecure use of localStorage/sessionStorage
   - Information leakage (e.g., stack traces, hardcoded secrets)

2. Evaluate the usage of:
   - Environment variables (`process.env`)
   - Token storage mechanisms (localStorage vs HTTP-only cookies)
   - HTTPS enforcement
   - CORS policies

3. Analyze dependency risks:
   - Insecure or outdated npm packages
   - Usage of deprecated libraries
   - Unpatched security advisories (via `npm audit`)

4. Suggest security improvements for:
   - Input sanitization/encoding
   - Proper error handling/logging
   - Secure routing and access control
   - Safe use of third-party components

5. Bonus Checks (if time allows):
   - SSRF, IDOR, Clickjacking vectors
   - Hardcoded secrets, API keys, tokens
   - Misconfigured CSP or headers

---

## Expected Output
- List of identified security issues with file/line references (if applicable)
- Suggestions to mitigate or fix each issue
- Severity rating for each finding: `Low`, `Medium`, `High`, `Critical`
- Confirmation if no major issues found
---

## Example Output Format

```json
[
  {
    "issue": "Direct use of dangerouslySetInnerHTML without sanitization",
    "severity": "High",
    "file": "src/components/CommentBox.tsx",
    "line": 42,
    "recommendation": "Use a sanitizer like DOMPurify before injecting HTML."
  },
  {
    "issue": "Token stored in localStorage",
    "severity": "Medium",
    "file": "src/utils/auth.ts",
    "line": 12,
    "recommendation": "Use HTTP-only cookies to store authentication tokens securely."
  }
]
