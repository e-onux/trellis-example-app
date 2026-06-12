// Contract tests for the three capabilities. Each test mirrors an example from the
// capability's contract.yaml (inputs and expected values are hard-coded here on purpose:
// the service has zero dependencies, so no YAML parser is available at test time).
// If a contract example changes, change the matching test in the same commit.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateShippingQuote } from '../src/quote.js';
import { resolveDestinationZone, listZones } from '../src/zones.js';
import { healthReport } from '../src/health.js';

// --- calculate-shipping-quote: mirrors capabilities/calculate-shipping-quote/contract.yaml examples

test('quote: domestic standard delivery', () => {
  const result = calculateShippingQuote({ destination: 'DE', weight_kg: 2, method: 'standard' });
  assert.deepEqual(result, { amount: { currency: 'EUR', value: 4.99 }, estimated_days: 3 });
});

test('quote: domestic express delivery', () => {
  const result = calculateShippingQuote({ destination: 'DE', weight_kg: 2, method: 'express' });
  assert.deepEqual(result, { amount: { currency: 'EUR', value: 11.99 }, estimated_days: 1 });
});

test('quote: international standard delivery', () => {
  const result = calculateShippingQuote({ destination: 'NL', weight_kg: 2, method: 'standard' });
  assert.deepEqual(result, { amount: { currency: 'EUR', value: 9.99 }, estimated_days: 5 });
});

test('quote: invalid package weight', () => {
  const result = calculateShippingQuote({ destination: 'DE', weight_kg: -1, method: 'standard' });
  assert.deepEqual(result, { error: { code: 'INVALID_WEIGHT' } });
});

test('quote: weight above the 30 kg maximum', () => {
  const result = calculateShippingQuote({ destination: 'DE', weight_kg: 30.01, method: 'standard' });
  assert.deepEqual(result, { error: { code: 'INVALID_WEIGHT' } });
});

test('quote: unknown delivery method', () => {
  const result = calculateShippingQuote({ destination: 'DE', weight_kg: 2, method: 'drone' });
  assert.deepEqual(result, { error: { code: 'INVALID_METHOD' } });
});

// Invariants: amount.value >= 0 and estimated_days >= 1 at the weight boundaries.
test('quote: invariants hold at weight boundaries', () => {
  for (const weight_kg of [0.01, 30]) {
    for (const method of ['standard', 'express']) {
      const result = calculateShippingQuote({ destination: 'NL', weight_kg, method });
      assert.ok(result.amount.value >= 0);
      assert.ok(result.estimated_days >= 1);
    }
  }
});

// --- resolve-destination-zone: mirrors capabilities/resolve-destination-zone/contract.yaml examples

test('zones: domestic destination', () => {
  const result = resolveDestinationZone('DE');
  assert.deepEqual(result, { zone: 'domestic', surcharge: { currency: 'EUR', value: 0 }, extra_days: 0 });
});

test('zones: international destination', () => {
  const result = resolveDestinationZone('NL');
  assert.deepEqual(result, { zone: 'international', surcharge: { currency: 'EUR', value: 5 }, extra_days: 2 });
});

test('zones: malformed destination', () => {
  const result = resolveDestinationZone('Germany');
  assert.deepEqual(result, { error: { code: 'INVALID_DESTINATION' } });
});

test('zones: listZones covers domestic and international', () => {
  const { zones } = listZones();
  assert.deepEqual(zones.map((z) => z.id), ['domestic', 'international']);
  assert.deepEqual(zones[0].destinations, ['DE']);
  assert.deepEqual(zones[1].surcharge, { currency: 'EUR', value: 5 });
  assert.equal(zones[1].extra_days, 2);
});

// --- health-report: mirrors capabilities/health-report/contract.yaml examples

test('health: service is ready', () => {
  assert.deepEqual(healthReport({ ready: true }), { ok: true });
});

test('health: service is not ready yet', () => {
  assert.deepEqual(healthReport({ ready: false }), { error: { code: 'NOT_READY' } });
});
