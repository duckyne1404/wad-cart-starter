# BRIEF — cartTotal implementation

**Course**: CSC13008 — Web Application Development, HK1 2026-2027
**Assignment**: IA#1
**Date**: 2026-09-29
**Tool used**: Google Antigravity (Claude Sonnet 4.6 Thinking)

---

## Role

You are a teaching assistant helping a student implement a pure-function JavaScript
module for a university homework assignment. Your job is to write code that satisfies
the specification below exactly, with zero creativity or over-engineering.

---

## Files you may touch

| File                | Permitted actions                                       |
| ------------------- | ------------------------------------------------------- |
| `src/cart.js`       | Replace the stub implementation with the correct code   |
| `test/cart.test.js` | Add atomic unit tests covering every rule in this brief |

You **must not** create new files, modify `package.json`, or add any `import` that
requires an external package. Treat everything else as read-only.

---

## Signature

```javascript
export function cartTotal(items, options) { … }
```

- **`items`** — `Array<{ name: string, price: number, qty: number }>` — the cart items.
- **`options`** — `{ vatRate: number, freeShipFrom: number, shipFee: number }` — pricing config.
- **Return** — a primitive `number`, rounded to the nearest whole number with `Math.round`.

---

## Computation rules (implement in this order)

### 1. Empty-cart short-circuit

If `items` is empty (length 0), return `0` immediately.
Do **not** calculate VAT or shipping for an empty cart.

### 2. Validation (check every item before summing)

For each item in `items`:

- If `item.price` is **strictly less than zero** (`< 0`): throw a `RangeError`.
  The message may be any informative string.
- If `item.qty` is **not a positive integer** (i.e., not `Number.isInteger(qty)` or `qty <= 0`):
  throw a `RangeError`. The message may be any informative string.

### 3. Subtotal

```
subtotal = sum of (item.price × item.qty) for all items
```

### 4. VAT

```
vat = subtotal × vatRate
```

### 5. Shipping

```
shipping = (subtotal >= freeShipFrom) ? 0 : shipFee
```

The boundary condition is **inclusive**: when `subtotal` is exactly equal to
`freeShipFrom`, shipping is free.

### 6. Final total

```
return Math.round(subtotal + vat + shipping)
```

The return value must be a **primitive number**, not a string.
Using `.toFixed()` is forbidden unless you wrap it in `Number(…)` — but the
simplest correct approach is `Math.round`.

---

## Worked example (must return `467400`)

```javascript
cartTotal(
  [
    { name: 'Áo thun', price: 180_000, qty: 2 },
    { name: 'Sổ tay', price: 45_000, qty: 1 },
  ],
  { vatRate: 0.08, freeShipFrom: 500_000, shipFee: 30_000 }
)
```

| Step      | Calculation                        | Value       |
| --------- | ---------------------------------- | ----------- |
| subtotal  | 180000×2 + 45000×1                 | 405 000     |
| VAT       | 405000 × 0.08                      | 32 400      |
| shipping  | 405000 < 500000 → shipFee          | 30 000      |
| **total** | Math.round(405000 + 32400 + 30000) | **467 400** |

---

## Constraint: zero external runtime dependencies

- Do **not** `npm install` any package.
- Do **not** add anything to `dependencies` in `package.json`.
- Use only the JavaScript standard library (`Number.isInteger`, `Math.round`, `Array`
  methods, etc.).

---

## Tests to write in `test/cart.test.js`

Each test must be **atomic** — it tests exactly one rule and fails for exactly one reason.
Use `import { test } from 'node:test'` and `import assert from 'node:assert/strict'`.

Required test cases:

1. **Worked example** — verifies the full computation returns `467400`.
2. **Empty cart returns `0`** — empty array, any options, must return `0`.
3. **Shipping applied** — subtotal strictly below `freeShipFrom` includes `shipFee`.
4. **Free shipping at exact threshold** — subtotal exactly equals `freeShipFrom`, shipping = 0.
5. **Free shipping above threshold** — subtotal strictly above `freeShipFrom`, shipping = 0.
6. **Return type is `number`** — `typeof cartTotal(…)` must equal `'number'`.
7. **RangeError on negative price** — `price: -1` must throw `RangeError`.
8. **RangeError on float qty** — `qty: 1.5` must throw `RangeError`.
9. **RangeError on zero qty** — `qty: 0` must throw `RangeError`.
10. **RangeError on negative qty** — `qty: -1` must throw `RangeError`.
