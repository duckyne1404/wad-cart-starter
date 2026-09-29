# SELF ASSESSMENT REPORT — IA#1: cartTotal

**Student**: Phí Hoàng Đức
**Student ID**: 24120248
**Email**: duckluvmyself@gmail.com
**Course**: CSC13008 — Web Application Development, HK1 2026-2027
**Repository**: https://github.com/duckyne1404/wad-cart-starter
**Date**: 2026-09-29
**Claimed total**: 100 / 100

---

## Rubric evidence table

| #   | Criterion                          |   Max   | Claimed | Evidence  |
| --- | ---------------------------------- | :-----: | :-----: | --------- |
| 1   | **cartTotal behaves as specified** |   30    |   30    | See below |
| 2   | **Tests**                          |   20    |   20    | See below |
| 3   | **The harness**                    |   20    |   20    | See below |
| 4   | **The brief**                      |   15    |   15    | See below |
| 5   | **AI-LOG.md**                      |   15    |   15    | See below |
|     | **Total**                          | **100** | **100** |           |

---

### Criterion 1 — cartTotal behaves as specified (30 / 30)

File: `src/cart.js` (commit `8b9f04d`)

| Sub-rule                          | Evidence in code                                         | Test verifying it                               |
| --------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Worked example returns 467400     | `Math.round(405000 + 32400 + 30000)` = 467400            | test 1 "the example from the slides" ✔          |
| Empty cart returns 0              | `if (!items \|\| items.length === 0) return 0` (line 14) | test 2 "empty cart returns 0" ✔                 |
| Shipping applied below threshold  | `subtotal >= freeShipFrom ? 0 : shipFee`                 | test 3 "shipping fee applied…" ✔                |
| Free shipping at exact threshold  | `>=` (inclusive)                                         | test 4 "exactly equals freeShipFrom" ✔          |
| Free shipping above threshold     | `>=` catches both equal and greater                      | test 5 "strictly exceeds freeShipFrom" ✔        |
| Return is a number                | `Math.round(...)` returns primitive number               | test 6 "cartTotal returns a primitive number" ✔ |
| Rounded to whole đồng             | `Math.round(...)` — no `.toFixed()`                      | test 1 (integer result), test 3 (138000) ✔      |
| Negative price → RangeError       | `if (item.price < 0) throw new RangeError(...)`          | test 7 ✔                                        |
| `price === 0` is valid (boundary) | Validation uses strict `< 0`, not `<= 0`                 | test 8 "price of zero is valid…" ✔              |
| Float qty → RangeError            | `!Number.isInteger(item.qty) \|\| item.qty <= 0`         | test 9 ✔                                        |
| Zero qty → RangeError             | `item.qty <= 0`                                          | test 10 ✔                                       |
| Negative qty → RangeError         | `item.qty <= 0`                                          | test 11 ✔                                       |
| Validation BEFORE summation       | Two separate loops: validate all → then sum              | confirmed by code structure (Step 5 fix)        |

All 11 tests pass (`npm test`: 11 pass, 0 fail).

---

### Criterion 2 — Tests (20 / 20)

File: `test/cart.test.js` (commit `8b9f04d`)

- **`npm test` is GREEN**: 11/11 tests pass, 0 failures.
- **Uses native runner**: `node:test` and `node:assert/strict` only — no Mocha/Jest/Chai.
- **Atomic tests**: each test has a single `assert.*` or `assert.throws`/`doesNotThrow`
  call targeting exactly one rule; if that rule breaks, only that test fails. Test 6
  uses neutral options `{vatRate:0, freeShipFrom:0, shipFee:0}` so only the return
  type is exercised, not shipping or VAT logic.
- **Coverage**:
  - Worked example (happy path with both shipping and VAT)
  - Empty cart edge case
  - Shipping threshold: 3 boundary tests (below, equal, above)
  - Return type guard (with neutral options — truly atomic)
  - `price === 0` boundary: confirms `< 0` (not `<= 0`) is the throw condition
  - All 4 `RangeError` cases: negative price, float qty, zero qty, negative qty

---

### Criterion 3 — The harness (20 / 20)

Files: `AGENTS.md`, `package.json`, `.github/workflows/ci.yml` (commit `0823dc8`)

**Rules file (`AGENTS.md`)**:

- Lists stack (Node ≥20, ES Modules, native test runner, Prettier devDep only).
- Lists all commands (`npm test`, `npm run lint`, `npm run format`, `npm run gate`).
- Explicitly states which files the agent may and may not touch.
- Contains 7 NEVER rules including: no runtime deps, no string return, no mutation,
  no `console.log` in `src/cart.js`, gate must pass before commit.
- Contains the full worked example with step-by-step breakdown.
- A stranger unfamiliar with this repository can follow it without additional context.

**Gate (`npm run gate`)**:

- Runs `npm run lint` (Prettier `--check`) then `npm test`.
- Fails early if formatting is wrong; fails if any test fails.
- Verified GREEN after Step 3 implementation (output in AI-LOG.md, Step 3).

**CI (`.github/workflows/ci.yml`)**:

- Triggers on `push` and `pull_request` to `main`/`master`.
- Steps: checkout → setup-node@v4 (Node 20) → npm install → `npm run gate`.

**npm test was RED before implementation**:

- Confirmed output: `Error: not implemented` at `src/cart.js:3:9`.
- This was observed and documented before any code was written (AI-LOG Step 1).

---

### Criterion 4 — The brief (15 / 15)

File: `BRIEF.md` (commit `a743e8a`)

- **Role** section sets context (teaching assistant, zero creativity).
- **Files you may touch** table lists exactly two files with permitted actions.
- **Signature** with full JSDoc type annotations.
- **Computation rules** in numbered order: empty-cart short-circuit, validation,
  subtotal, VAT, shipping (with explicit "inclusive" boundary note), final total.
- **Worked example** with step-by-step breakdown table yielding 467400.
- **Constraint** section: "Do NOT `npm install` any package. Do NOT add anything
  to `dependencies`."
- **Test case list**: 10 required cases numbered and described.
- A stranger reading only `BRIEF.md` and `AGENTS.md` could instruct a different
  assistant and receive an identical implementation and test suite.

---

### Criterion 5 — AI-LOG.md (15 / 15)

File: `AI-LOG.md` (commit in Step 4)

- **Tool identified**: Google Antigravity IDE — Claude Sonnet 4.6 (Thinking mode).
- **Step 1**: Exact prompt, list of files AI generated, what I reviewed,
  what I rejected (CI `npm ci` → changed to `npm install`).
- **Step 2**: Exact prompt, what AI generated, what I reviewed (boundary wording).
- **Step 3**: Exact prompt for each round (implementation + tests); inline diff
  of generated code; 7-point checklist of what I verified line by line;
  manual arithmetic check for tests 3–5; gate output pasted verbatim; lint
  issue encountered and resolved.
- **Human contributions** section explicitly lists non-AI work: workflow
  direction, rejection, manual arithmetic, lint fix, git commands, gate observation.
- All claims are verifiable against `git log --oneline` commits:
  `56048c0` (starter), `0823dc8` (step 1), `a743e8a` (step 2), `8b9f04d` (step 3).

---

## What I did not manage

Nothing critical was unresolved. All specification rules are implemented, tested,
and documented. The gate is consistently GREEN across lint and test. The CI
workflow (`.github/workflows/ci.yml`) is live on GitHub Actions and will run
`npm run gate` automatically on every push and pull_request to `main`.

A minor cosmetic note: the `package-lock.json` was not part of the starter but
was generated by `npm install` and committed as part of Step 1. This is expected
and correct behaviour when adding the first devDependency.

---

## Review cycle corrections (Step 5)

After a strict self-review pass, four issues were found and corrected (see `AI-LOG.md`
Step 5 for full diffs):

| Issue                                                   | File                | Fix                                                         |
| ------------------------------------------------------- | ------------------- | ----------------------------------------------------------- |
| CI used `npm install` (non-deterministic)               | `ci.yml`            | Changed to `npm ci`                                         |
| Validation happened inside summation loop               | `src/cart.js`       | Split into two loops: validate-all then sum-all             |
| Test 6 not truly atomic (used `OPTS` with VAT/shipping) | `test/cart.test.js` | Changed to neutral `{vatRate:0, freeShipFrom:0, shipFee:0}` |
| No boundary test for `price === 0`                      | `test/cart.test.js` | Added `doesNotThrow` test for `price: 0`                    |

Final state: `npm run gate` GREEN, 11/11 tests, lint clean.
