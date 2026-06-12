// Capability: calculate-shipping-quote (capabilities/calculate-shipping-quote/contract.yaml)
// Pure pricing function plus the POST /quote handler logic. Prices are computed in cents
// to avoid floating-point drift.

import { resolveDestinationZone } from './zones.js';

const METHODS = {
  standard: { base_cents: 299, per_kg_cents: 100, days: 3 },
  express: { base_cents: 799, per_kg_cents: 200, days: 1 }
};

const MIN_WEIGHT_KG = 0.01;
const MAX_WEIGHT_KG = 30;

/**
 * Calculate a shipping quote.
 * @param {{destination: string, weight_kg: number, method: string}} input
 * @returns {{amount: {currency: string, value: number}, estimated_days: number} | {error: {code: string}}}
 */
export function calculateShippingQuote(input = {}) {
  const { destination, weight_kg, method } = input;
  if (typeof weight_kg !== 'number' || Number.isNaN(weight_kg) || weight_kg < MIN_WEIGHT_KG || weight_kg > MAX_WEIGHT_KG) {
    return { error: { code: 'INVALID_WEIGHT' } };
  }
  const m = METHODS[method];
  if (!m) {
    return { error: { code: 'INVALID_METHOD' } };
  }
  const zone = resolveDestinationZone(destination);
  if (zone.error) {
    return zone;
  }
  const cents = Math.round(m.base_cents + m.per_kg_cents * weight_kg + zone.surcharge.value * 100);
  return {
    amount: { currency: 'EUR', value: cents / 100 },
    estimated_days: m.days + zone.extra_days
  };
}
