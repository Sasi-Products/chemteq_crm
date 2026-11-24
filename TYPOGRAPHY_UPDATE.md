# CTA / LiquidTeq CRM — Inter Typography Update

This version retains the existing features, ES6 modules, API integrations, permission logic, and logos.

## Changes
- Loads Google Fonts Inter weights 400–900 in `index.html` using preconnect (with system font fallback).
- Removes redundant CSS `@import` from `src/styles.css`.
- Imports a dedicated `src/typography.css` after the original stylesheet in `src/main.jsx`.
- Uses larger, consistent type for sidebar, page headings, cards, data tables, badges, forms and buttons.
- Adds tabular numeral formatting for financial figures and responsive sizes for mobile.
- No backend or SQL modifications.

## Apply just these files to an existing frontend

1. Backup your project if you have local edits.
2. Extract `CTA_LTQ_Typography_Patch.zip` into the existing frontend root (e.g. `CTA_LTQ_Frontend`).
3. Run `npm run dev` or `npm run build` from the frontend root.

## Notes
Inter is retrieved from fonts.googleapis.com. With no network connection, the system font fallback applies.
