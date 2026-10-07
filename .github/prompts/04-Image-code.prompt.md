---
context: ../design-system/base.md
context: ../design-system/common-components.md
---
"Convert the attached UI design into a pixel-perfect React functional component using:
- Tailwind CSS for layout and styling
- Common components from `../design-system/common-components.md`
- Design principles from `../design-system/base.md`"
Follow modern React best practices and include the following requirements:
1. "Use TypeScript for type safety and maintainability."
2. "Reference common components already defined in the application folder where applicable."
3. "Ensure the HTML is semantic and accessible. Add ARIA labels to improve screen reader compatibility"."
4. "Design the component to be modular and reusable."
5. "Apply Tailwind CSS utility classes for styling. Avoid inline styles unless absolutely necessary."
6. "Ensure UI/UX consistency with the source screenshot. Match layout and spacing pixel-perfectly."
7. "Implement responsive layout using Flexbox or Grid as appropriate."
8. "Make the component test-ready — structure it for easy testing with Jest or React Testing Library."
9. "Use clean, meaningful naming, and apply React hooks (useState, useEffect) where needed."
10. "Follow all text decorations and typography styles visible in the screenshot."
11. "Use icons from the lucide-react library for all iconography shown in the UI. Import only the icons that are visually relevant to the screenshot."
12. "Do not miss any elements in conversions"
13. "Pick background and foreground colors from the design"
14. "Use <Typography /> with props - tag as h1 to h6, fontWeight in numbers, align as left, center, right, color as hex code or tailwind color names, size as text-sm to text-9xl, className for additional tailwind classes"
15. "Use <Button /> with props - variant as primary, secondary, tertiary, text, link, size as small, medium, large, fullWidth as boolean, disabled as boolean, startIcon and endIcon as ReactNode, className for additional tailwind classes"
16. "Use <Input /> with props - type as text, password, email, number", placeholder as string, value as string, onChange as (e: React.ChangeEvent<HTMLInputElement>) => void, disabled as boolean, readOnly as boolean, size as small, medium, large, fullWidth as boolean, className for additional tailwind classes"
17. "Use <Card /> with props - variant as elevated, outlined, flat, hoverable, className for additional tailwind classes"
18. "Use common components from the `/components/common/` folder and update the relative path from the cile/folder"
After generating the component, apply this additional layout rule:
Align menu items, navigation bar, sidebar links (e.g., left, center, right) according to their visual positioning in the screenshot.