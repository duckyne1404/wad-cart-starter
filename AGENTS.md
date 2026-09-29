# AGENTS.md — Rules for AI coding assistants

This file governs any AI agent (Copilot, Gemini, Claude, etc.) working in this repository.
Read it entirely before writing a single line of code.

---

## Stack

| Layer                | Technology                      | Version                     |
| -------------------- | ------------------------------- | --------------------------- |
| Runtime              | Node.js                         | >= 20                       |
| Module system        | ES Modules (`"type": "module"`) | —                           |
| Test runner          | `node:test` (built-in)          | —                           |
| Assertion library    | `node:assert/strict` (built-in) | —                           |
| Formatter            | Prettier                        | ^3.5.3 (devDependency only) |
| Runtime dependencies | **NONE**                        | —                           |

---

## Repository layout

```
wad-cart-starter/
├── src/
│   └── cart.js            ← the only production file
├── test/
│   └── cart.test.js       ← unit tests (Node native runner)
├── .github/
│   └── workflows/
│       └── ci.yml         ← CI gate (GitHub Actions)
├── AGENTS.md              ← this file
├── BRIEF.md               ← assignment brief given to the assistant
├── AI-LOG.md              ← diary of AI usage
├── SELF_ASSESSMENT_REPORT.md ← rubric self-assessment
├── package.json
└── README.md
```

---

## Commands

```bash
npm test          # Run Node.js native test runner (must be GREEN before any commit)
npm run lint      # Check code formatting with Prettier (no writes)
npm run format    # Auto-format all files with Prettier (writes in place)
npm run gate      # Full pre-commit gate: lint check + test (must pass before committing)
```

---

## What you MAY touch

| File                                                 | Allowed changes                        |
| ---------------------------------------------------- | -------------------------------------- |
| `src/cart.js`                                        | Implement / fix `cartTotal`            |
| `test/cart.test.js`                                  | Add or improve unit tests              |
| `package.json`                                       | Update scripts or devDependencies only |
| `.github/workflows/ci.yml`                           | Update CI configuration                |
| `BRIEF.md`, `AI-LOG.md`, `SELF_ASSESSMENT_REPORT.md` | Authorship documents                   |

---

## NEVER rules — violating these fails the assignment

1. **NEVER** add an external package to `dependencies` in `package.json`. The `cartTotal` implementation must use zero external runtime libraries. Only `devDependencies` (e.g., Prettier) are allowed.

2. **NEVER** return a string from `cartTotal`. Use `Math.round(...)` which produces a primitive `number`. Do **NOT** use `.toFixed()` unless you immediately convert back with `Number(...)`.

3. **NEVER** mutate the `items` array or any of its elements, or the `options` object passed to `cartTotal`.

4. **NEVER** use `console.log`, `process.exit`, or any side-effect in `src/cart.js`. It is a pure function module.

5. **NEVER** commit while `npm run gate` is failing. Gate must be GREEN before every commit.

6. **NEVER** skip or mock the `RangeError` cases. The function must throw an actual `RangeError` instance (not `Error`, not `TypeError`) when `price < 0` or `qty` is not a positive integer.

7. **NEVER** install `node_modules` as tracked files. `node_modules/` is in `.gitignore`.

---

## Contract summary (full spec in `BRIEF.md`)

```
cartTotal(items, options) → number

subtotal  = sum of (item.price × item.qty)
VAT       = subtotal × vatRate
shipping  = subtotal >= freeShipFrom ? 0 : shipFee
result    = Math.round(subtotal + VAT + shipping)

Edge cases:
  - Empty items array           → return 0 immediately
  - item.price < 0              → throw RangeError
  - item.qty not a positive int → throw RangeError
```

---

## Worked example (must equal 467400)

```javascript
cartTotal(
  [
    { name: 'Áo thun', price: 180_000, qty: 2 },
    { name: 'Sổ tay', price: 45_000, qty: 1 },
  ],
  { vatRate: 0.08, freeShipFrom: 500_000, shipFee: 30_000 }
)
// subtotal = 360000 + 45000 = 405000
// VAT      = 405000 × 0.08 = 32400
// shipping = 30000 (405000 < 500000)
// total    = Math.round(405000 + 32400 + 30000) = 467400 ✓
```
