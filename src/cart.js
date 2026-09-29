// Implement cartTotal here. See README.md for the specification.

/**
 * Calculates the total cost of a shopping cart including VAT and shipping.
 *
 * @param {Array<{ name: string, price: number, qty: number }>} items - Cart items
 * @param {{ vatRate?: number, freeShipFrom?: number, shipFee?: number }} [options={}] - Pricing config
 * @returns {number} Final total rounded to the nearest whole đồng (Math.round)
 * @throws {RangeError} If any item.price is negative
 * @throws {RangeError} If any item.qty is not a positive integer
 */
export function cartTotal(items, options = {}) {
  // Empty-cart short-circuit: return 0 with no VAT or shipping
  if (!items || items.length === 0) {
    return 0
  }

  const { vatRate = 0, freeShipFrom = 0, shipFee = 0 } = options || {}

  // Validate all items and compute subtotal
  let subtotal = 0
  for (const item of items) {
    if (item.price < 0) {
      throw new RangeError(
        `item.price must be >= 0, got ${item.price} (item: "${item.name}")`
      )
    }
    if (!Number.isInteger(item.qty) || item.qty <= 0) {
      throw new RangeError(
        `item.qty must be a positive integer, got ${item.qty} (item: "${item.name}")`
      )
    }
    subtotal += item.price * item.qty
  }

  const vat = subtotal * vatRate
  // Shipping is free when subtotal >= freeShipFrom (boundary is inclusive)
  const shipping = subtotal >= freeShipFrom ? 0 : shipFee

  return Math.round(subtotal + vat + shipping)
}
