# Common Component Library

Available components to reuse in your page. When implementing, ensure all props follow accessibility standards (WCAG 2.2 Level AA) and include proper ARIA attributes where applicable.

## Form & Input Components

### `<Accordion />`
Props: `id`, `className`, `title`, `expanded`, `size` (`small` | `medium` | `large`), `variant` (`elevation` | `outlined`), `isOpen`, `onChange`, `tooltip`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-hidden`, `aria-controls`, `aria-live`, `aria-invalid`, `children`

### `<AutoComplete />`
Props: `id`, `name`, `className`, `value`, `placeholder`, `label`, `required`, `disabled`, `readOnly`, `title`, `size` (`small` | `medium`), `autoFocus`, `onChange`, `disableClearable`, `onFocus`, `onBlur`, `tooltip`, `options`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-disabled`, `aria-controls`, `aria-live`, `aria-invalid`, `aria-required`

### `<Button />`
Props: `variant` (`text` | `outlined` | `contained`), `color` (`primary` | `secondary` | `success` | `error` | `info` | `warning` | `inherit`), `size` (`small` | `medium` | `large`), `fullWidth`, `startIcon`, `endIcon`, `disableElevation`, `disabled`, `ariaLabel`, `onClick`, `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`, `id`, `className`, `children`

### `<Checkbox />`
Props: `id`, `name`, `className`, `value`, `defaultChecked`, `checked`, `label`, `required`, `disabled`, `size` (`small` | `medium`), `variant` (`outline` | `filled`), `tabIndex`, `onClick`, `onChange`, `onFocus`, `onBlur`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-hidden`, `aria-disabled`, `aria-live`, `aria-invalid`, `aria-required`

### `<FormInput />`
Props: `label`, `required`, `error`, `helperText`, `size` (`sm` | `md` | `lg`), `variant` (`outlined` | `filled` | `standard`), `inputRef`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-disabled`, `aria-invalid`, `aria-required`, `id`, `name`, `className`, `type`, `placeholder`, `value`, `onChange`, `onFocus`, `onBlur`, `onClick`, `disabled`, `readOnly`

### `<NumberField />`
Props: `id`, `name`, `className`, `value`, `defaultValue`, `placeholder`, `label`, `required`, `disabled`, `readOnly`, `min`, `max`, `step`, `title`, `error`, `size` (`sm` | `md` | `l`), `variant` (`outlined` | `filled` | `standard`), `inputRef`, `autoFocus`, `autoComplete`, `activeStep`, `onChange`, `onFocus`, `onBlur`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-disabled`, `aria-live`, `aria-invalid`, `aria-required`

### `<RadioGroup />`
Props: `id`, `className`, `label`, `required`, `disabled`, `error`, `size` (`small` | `medium` | `large`), `inputRef`, `onFocus`, `onBlur`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-disabled`, `aria-required`, `aria-orientation` (`horizontal` | `vertical`), `children`

### `<Select />`
Props: `id`, `name`, `className`, `value`, `defaultValue`, `label`, `required`, `disabled`, `htmlFor`, `title`, `error`, `size` (`small` | `medium` | `large`), `variant` (`outlined` | `filled` | `standard`), `inputRef`, `autoFocus`, `onChange`, `onFocus`, `onBlur`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-required`, `children`

### `<FileUpload />`
Props: `id`, `name`, `className`, `value`, `label`, `required`, `disabled`, `readOnly`, `tabIndex`, `error`, `size` (`small` | `medium` | `large`), `variant` (`contained` | `outlined` | `text`), `helperText`, `accept`, `multiple`, `onChange`, `onFocus`, `onBlur`, `tooltip`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-disabled`, `aria-live`, `aria-required`

## Display & Container Components

### `<Card />`
Props: `title`, `children`, `footer`, `className`, `shadow`, `border`

### `<CardHeader />`
Props: `children`, `className`

### `<CardContent />`
Props: `children`, `className`

### `<CardFooter />`
Props: `children`, `className`

### `<CardActions />`
Props: `children`, `className`

### `<List />`
Props: `id`, `className`, `tooltip`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-controls`, `aria-live`, `children`

### `<Link />`
Props: `to`, `title`, `id`, `className`, `target`, `color` (`primary` | `secondary` | `inherit`), `size` (`small` | `medium` | `large`), `underline` (`none` | `hover` | `always`), `onFocus`, `onBlur`, `tabIndex`, `aria-labelledby`, `aria-describedby`, `aria-label`, `aria-current` (`page` | `step` | `location` | `date` | `time` | `boolean`), `children`

### `<Typography />`
Props: `tag`, `fontWeight`, `align`, `className`, `children`, `variant`, `color`

### `<Modal />`
Props: `isOpen`, `onClose`, `title`, `children`, `footer`, `size`, `closeButton`

## Menu Components

### `<Menu />`
Props: `id`, `className`, `disabled`, `tabIndex`, `variant` (`default` | `primary` | `secondary` | `danger` | `link`), `size` (`sm` | `md` | `lg`), `rounded` (`none` | `sm` | `md` | `full`), `onClick`, `onFocus`, `onBlur`, `tooltip`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-disabled`, `aria-selected`, `aria-controls`, `aria-current` (`page` | `step` | `location` | `date` | `time` | `boolean`), `aria-orientation` (`horizontal` | `vertical`), `children`

### `<MenuContainer />`
Props: `id`, `className`, `tooltip`, `orientation` (`vertical` | `horizontal`), `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `children`

### `<MenuItem />`
Props: `id`, `className`, `disabled`, `selected`, `title`, `tooltip`, `size` (`sm` | `md` | `lg`), `onClick`, `onFocus`, `onBlur`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-disabled`, `aria-current` (`page` | `step` | `location` | `date` | `time` | `boolean`), `children`

## Navigation Components

### `<Tabs />`
Props: `tabItems`, `tabContents`, `initialActiveTab`, `onTabChange`, `width`, `variant`, `disabled`

### `<Pagination />`
Props: `currentPage`, `totalPages`, `onPageChange`, `disabled`, `showJumpTo`

### `<Stepper />`
Props: `id`, `className`, `type` (`linear` | `non-linear`), `value`, `defaultValue`, `disabled`, `min`, `max`, `step`, `title`, `activeStep`, `onClick`, `onFocus`, `onBlur`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-disabled`, `aria-controls`, `aria-current`, `aria-live`, `children`

### `<StepContent />`
Props: `children`, `className`, `style`

## Feedback Components

### `<Snackbar />`
Props: `id`, `className`, `snackbarClassName`, `closeButtonClassName`, `startDecorator`, `endDecorator`, `size` (`small` | `medium` | `large`), `variant` (`filled` | `outlined` | `standard`), `autoHideDuration`, `position` (`bottom-right` | `bottom-left` | `bottom-center` | `top-right` | `top-left` | `top-center`), `open`, `onClose`, `enterAnimation`, `exitAnimation`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `children`

### `<Tooltip />`
Props: `title`, `children`, `className`, `size` (`small` | `medium` | `large`), `placement` (`top` | `bottom` | `left` | `right`), `aria-label`, `aria-labelledby`, `aria-describedby`, `enterDelay`, `leaveDelay`

## Progress Components

### `<CircularProgress />`
Props: `id`, `className`, `value`, `aria-valuenow`, `aria-valuetext`, `size`, `variant` (`determinate` | `indeterminate`), `title`, `aria-label`, `aria-labelledby`

### `<LinearProgress />`
Props: `id`, `value`, `variant` (`determinate` | `indeterminate` | `buffer` | `query`), `color` (`primary` | `secondary` | `error` | `info` | `success` | `warning` | `inherit`), `className`, `title`, `size` (`small` | `medium` | `large`), `aria-label`, `aria-labelledby`

## Data Display Components

### `<Table />`
Props: `headers`, `data`, `width`, `striped`, `bordered`, `sortable`, `onSort`, `caption`

