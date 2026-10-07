---
tools: []
description: 'Create JSON object configuration for form fields and generate a JSON-driven React page using a shared validation service.'
---

# JSON-Driven Form Page Template Prompt

## Overview

This prompt provides a **generic and enforceable template** for creating JSON-driven form pages in a React application.

Instead of hardcoding form fields in component code:
* All form fields must be defined in a JSON configuration file
* The React page component must consume the JSON configuration to render UI
* The same component logic must be reusable across different pages

This approach improves maintainability, scalability, and consistency across forms.

---

## Mandatory Generation Rules

When generating any form page, the following rules **must** be followed:

* A `.json` configuration file must be created inside `src/config`
* A `.tsx` page component must be created inside `src/pages`
* The page name must match the requested form name
  * Example: `Login` → `src/pages/Login.tsx`
* The JSON file name must be derived from the page name
  * Example: `Login` → `src/config/login.form.json`
* The `.tsx` page must import and use the generated `.json` file
* No form field may be hardcoded inside JSX
* All validation must be handled via `validationService` from `src/script`
* Inline validation logic inside the page component is not allowed

---

## Step-by-Step Implementation

### Step 1: Create Form Configuration File (JSON)

Create a JSON configuration file inside `src/config`.

* The JSON must define **all form fields, attributes, and validation rules**
* Regular expressions must be stored as **strings** in JSON
* Each field must be keyed by its unique identifier

Example:

```json
{
  "email": {
    "id": "email",
    "type": "email",
    "name": "email",
    "placeholder": "",
    "label": "Email Address",
    "value": "",
    "isRequired": true,
    "hasError": false,
    "errorMessage": "",
    "validationRules": {
      "required": {
        "value": true,
        "message": "Email is required."
      },
      "pattern": {
        "value": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        "message": "Please enter a valid email address."
      }
    },
    "ariaLabel": "Email Address",
    "ariaDescribedBy": "emailHelp",
    "tooltip": "We'll never share your email with anyone else."
  },
  "password": {
    "id": "password",
    "type": "password",
    "name": "password",
    "placeholder": "",
    "label": "Password",
    "value": "",
    "isRequired": true,
    "hasError": false,
    "errorMessage": "",
    "validationRules": {
      "required": {
        "value": true,
        "message": "Password is required."
      },
      "minLength": {
        "value": 6,
        "message": "Password must be at least 6 characters long."
      }
    },
    "ariaLabel": "Password",
    "ariaDescribedBy": "passwordHelp",
    "tooltip": "Choose a strong password to keep your account secure."
  }
}
```

once the form configuration JSON is ready, proceed to Step 2.

### Step 2: setup form object in react state hook
const [formData, setFormData] = useState<FormDataType>(() => {
  const initialData: FormDataType = {};
  clonedFormConfig.form.inputs.forEach((input: any) => {
    initialData[input.id] = '';
  });
  return initialData;
});

### Step 3: render the form inputs by JSON object node names
Example:
<TextField {...formData.email} onChange={(e) => handleInputChange(e)} />
<TextField {...formData.password} onChange={(e) => handleInputChange(e)} />

### Step 4: write a common event handlers for all form input change event
const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type, checked } = e.target;
  // if any consitions required based on field id/name add a switchcase or if condition here
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : value,
  });
};

### Step 5: handle form submission and validation
const handleFormSubmit = (e: FormEvent) => {
  e.preventDefault();
  const newErrors: FormFieldError = {};
  let hasErrors = false;

  import a common validation method from utils/validation.ts file
  const {status, formData} = validationService.validateformObject(formData);

  setErrorStatus(status);

  if (status) {
    // Process form submission (e.g., API call)
    console.log('Form submitted successfully:', formData);
  }
}; 

---
By following this prompt, you can create flexible, reusable forms driven entirely by JSON configurations, improving maintainability and scalability in your React applications.