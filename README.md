# LiquidTeq + Chem Tex Aqua — CRM Admin Panel

One professional responsive React/Vite SPA for two businesses that share business owners and selected staff, while keeping company-specific accounts, stock, quotes, documents, and permissions separate.

## Install

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL=http://localhost:8080/api` (or `https://your-api-domain.com/api`) in `.env` **before** building. Open `http://localhost:5173`, then sign in using your freshly bootstrapped Super Admin account. On production:

```bash
npm run build
```

Deploy the contents of `dist/` to the frontend's HTTPS document root (for example Plesk's `httpdocs/`). The web UI operates as an SPA and uses in-page navigation; no backend route rewrites are needed. Ensure API HTTPS and CORS origin are set in backend `.env`.

## Recommended first-run demonstration

1. Select **LiquidTeq** or **Chem Tex Aqua** in the top-right company switcher.
2. Super Admin: go to **Company settings** and verify official GSTIN, registered address, bank account and contact data for each company.
3. Add your **clients and vendors**, their bill-to/ship-to addresses and payment terms.
4. Add **products**, HSN/SAC codes, GST rates, units and warehouse locations.
5. Create a **project** for the proper company/client. Add its requirements.
6. Create **Vendor RFQ**, invite suppliers and enter their returned offers. Compare landed prices per material, select winning suppliers and generate draft POs automatically.
7. Approve the POs, **receive physical goods** against a GRN and, when used, issue materials to the project.
8. Post a **vendor bill**, optionally allocate its total between projects, then record one or more payments from **Receivables & payables**.
9. Send a **customer quotation**, accept it and create a draft invoice; issue and print it, then receive multiple client instalments.
10. Open **Project profit & loss** to see booked revenue, issued material costs, direct services, expenses, receivables and allocated supplier payables.
11. Use **Intercompany transfers** when the other company buys goods from the selected company.
12. Add employees with **per-company permissions**, record attendance and create follow-up reminders.

The company logo files are in `public/logos/`, as requested. The frontend has no built-in usernames, passwords or real customer financial values.

### Important

The UI can *record* official IRN and e-way-bill numbers; it does **not** generate or submit them to the GST portal without a separately authorised integration. PDFs are working print layouts, not a substitute for legally compliant tax issuance review.

The source is a functional first release for your client demonstration. Production acceptance, a live MySQL end-to-end trial, real GST provider integration and full user-acceptance tests have not been completed in this offline build environment.

## ES6 module edition (v1.0.1)

The React frontend was already written using native ES module syntax (`import`/`export`) and Vite. It remains `"type": "module"` and contains no CommonJS application code. This updated frontend is paired with the backend ES-module edition. No API URL or database structure changes were needed.
# chemteq_crm
