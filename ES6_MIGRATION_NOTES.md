# ES6 module edition

Version: 1.0.1

The existing React/Vite frontend was already an ES-module application. This archive is paired with the ES6-converted backend. It retains the original screens, components, styles, logos, and API endpoints.

- `package.json` retains `"type": "module"`.
- All frontend JavaScript/JSX uses `import`/`export`; no `require` / `module.exports`.
- React application and Vite config use ESM imports.
- Both logos remain in `public/logos/`.

```sh
npm install
npm run dev
# or npm run build
```

The 6 JS/JSX files in `src/` passed TypeScript's JSX/ES2022 parser. Frontend bundling was not run because dependencies were not installed in this environment.
