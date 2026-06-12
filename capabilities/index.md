# Capabilities

Every meaningful, user- or system-visible behavior is a capability with a bounded contract. This index lists
them; `capability-map.yaml` is the machine-readable map used by `trellis audit`.

| Capability | Status | Owner | Contract | Implementation |
|---|---|---|---|---|
| [calculate-shipping-quote](./calculate-shipping-quote/contract.yaml) | active | shipping | POST /quote | `src/quote.js` |
| [resolve-destination-zone](./resolve-destination-zone/contract.yaml) | active | shipping | GET /zones | `src/zones.js` |
| [health-report](./health-report/contract.yaml) | active | platform | GET /health | `src/health.js` |

## Adding a capability

Create `capabilities/<id>/contract.yaml` (kebab-case id), fill in the contract with at least one normal and
one error example, point `implementation:` at the real source files, add the entry to `capability-map.yaml`,
and mirror the examples in `tests/`. Then run `trellis validate` and `trellis audit`.
