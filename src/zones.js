// Capability: resolve-destination-zone (capabilities/resolve-destination-zone/contract.yaml)
// Maps a destination country code to a shipping zone and lists supported zones.

const DOMESTIC = ['DE'];
const INTERNATIONAL_SURCHARGE = { currency: 'EUR', value: 5 };
const INTERNATIONAL_EXTRA_DAYS = 2;

/**
 * Resolve a destination country code to its shipping zone.
 * @param {string} destination ISO 3166-1 alpha-2 country code, uppercase.
 * @returns {{zone: string, surcharge: {currency: string, value: number}, extra_days: number} | {error: {code: string}}}
 */
export function resolveDestinationZone(destination) {
  if (typeof destination !== 'string' || !/^[A-Z]{2}$/.test(destination)) {
    return { error: { code: 'INVALID_DESTINATION' } };
  }
  if (DOMESTIC.includes(destination)) {
    return { zone: 'domestic', surcharge: { currency: 'EUR', value: 0 }, extra_days: 0 };
  }
  return { zone: 'international', surcharge: INTERNATIONAL_SURCHARGE, extra_days: INTERNATIONAL_EXTRA_DAYS };
}

/**
 * List all supported destination zones. Backs GET /zones.
 */
export function listZones() {
  return {
    zones: [
      { id: 'domestic', destinations: DOMESTIC, surcharge: { currency: 'EUR', value: 0 }, extra_days: 0 },
      { id: 'international', destinations: 'all other ISO 3166-1 alpha-2 codes', surcharge: INTERNATIONAL_SURCHARGE, extra_days: INTERNATIONAL_EXTRA_DAYS }
    ]
  };
}
