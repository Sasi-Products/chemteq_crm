# Vendor Bills crash — ReceiptText import fix

This patch adds `ReceiptText` to the existing `lucide-react` imports in `src/pages/Pages.jsx`.

Apply from the CTA_LTQ_Frontend directory:

```bash
cp src/pages/Pages.jsx src/pages/Pages.jsx.before_receipt_fix && unzip -o "$HOME/Downloads/CTA_LTQ_ReceiptText_Fix.zip" -d .
```

Your existing Vite dev server should hot reload. If it is not already running: `npm run dev`.

No backend, database, dependencies or installation changes are required.
