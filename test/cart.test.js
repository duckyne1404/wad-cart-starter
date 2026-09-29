import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cartTotal } from '../src/cart.js'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const OPTS = { vatRate: 0.08, freeShipFrom: 500_000, shipFee: 30_000 }

// ---------------------------------------------------------------------------
// 1. Worked example from the slides (must equal 467400)
// ---------------------------------------------------------------------------

// This test fails until you implement cartTotal. That is the point:
// run `npm test` first and see it red.
test('the example from the slides', () => {
  const items = [
    { name: 'Áo thun', price: 180_000, qty: 2 },
    { name: 'Sổ tay', price: 45_000, qty: 1 },
  ]
  assert.equal(cartTotal(items, OPTS), 467_400)
})

// ---------------------------------------------------------------------------
// 2. Empty cart
// ---------------------------------------------------------------------------

test('empty cart returns 0', () => {
  assert.equal(cartTotal([], OPTS), 0)
})

// ---------------------------------------------------------------------------
// 3–5. Shipping threshold (below / exact / above)
// ---------------------------------------------------------------------------

test('shipping fee applied when subtotal is below freeShipFrom', () => {
  // subtotal = 100 000 < 500 000 → shipFee 30 000 applies
  const items = [{ name: 'X', price: 100_000, qty: 1 }]
  const result = cartTotal(items, OPTS)
  // 100000 + 8000 VAT + 30000 shipping = 138000
  assert.equal(result, 138_000)
})

test('free shipping when subtotal exactly equals freeShipFrom', () => {
  // subtotal = 500 000 === 500 000 → shipping = 0
  const items = [{ name: 'X', price: 500_000, qty: 1 }]
  const result = cartTotal(items, OPTS)
  // 500000 + 40000 VAT + 0 shipping = 540000
  assert.equal(result, 540_000)
})

test('free shipping when subtotal strictly exceeds freeShipFrom', () => {
  // subtotal = 600 000 > 500 000 → shipping = 0
  const items = [{ name: 'X', price: 600_000, qty: 1 }]
  const result = cartTotal(items, OPTS)
  // 600000 + 48000 VAT + 0 shipping = 648000
  assert.equal(result, 648_000)
})

// ---------------------------------------------------------------------------
// 6. Return type is a primitive number
// ---------------------------------------------------------------------------

test('cartTotal returns a primitive number (not a string)', () => {
  // Neutral options (zero VAT, free shipping always) — only the return TYPE is under test
  const neutralOpts = { vatRate: 0, freeShipFrom: 0, shipFee: 0 }
  const items = [{ name: 'X', price: 100_000, qty: 1 }]
  const result = cartTotal(items, neutralOpts)
  assert.equal(typeof result, 'number')
})

// ---------------------------------------------------------------------------
// 7–10. RangeError cases
// ---------------------------------------------------------------------------

test('throws RangeError for a negative price', () => {
  const items = [{ name: 'X', price: -1, qty: 1 }]
  assert.throws(() => cartTotal(items, OPTS), RangeError)
})

test('price of zero is valid and does NOT throw (boundary: price < 0, not <= 0)', () => {
  // price === 0 sits exactly on the boundary — must NOT throw, must return a number
  const items = [{ name: 'X', price: 0, qty: 1 }]
  assert.doesNotThrow(() => cartTotal(items, OPTS))
  assert.equal(typeof cartTotal(items, OPTS), 'number')
})

test('throws RangeError for a non-integer (float) quantity', () => {
  const items = [{ name: 'X', price: 10_000, qty: 1.5 }]
  assert.throws(() => cartTotal(items, OPTS), RangeError)
})

test('throws RangeError for qty of zero', () => {
  const items = [{ name: 'X', price: 10_000, qty: 0 }]
  assert.throws(() => cartTotal(items, OPTS), RangeError)
})

test('throws RangeError for a negative quantity', () => {
  const items = [{ name: 'X', price: 10_000, qty: -1 }]
  assert.throws(() => cartTotal(items, OPTS), RangeError)
})
