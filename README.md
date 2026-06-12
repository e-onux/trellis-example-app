# shipping-quotes - a Trellis worked example

A small, real, zero-dependency Node.js HTTP service (three JSON endpoints) governed by the
[Trellis](https://github.com/e-onux/trellis) standard. The service itself is deliberately boring;
the point is the governance around it: every behavior is a capability with a bounded contract,
budgets measure the real source files, and `trellis audit` enforces the quality gates in CI.

Trellis standard: https://github.com/e-onux/trellis | https://trellis.sidre.site

## What to look at

- `capabilities/<id>/contract.yaml` - one contract per capability ([calculate-shipping-quote](capabilities/calculate-shipping-quote/contract.yaml), [resolve-destination-zone](capabilities/resolve-destination-zone/contract.yaml), [health-report](capabilities/health-report/contract.yaml)), each with inputs, outputs, normal and error examples, invariants and budgets.
- The `implementation:` key in each contract - budgets measure the real files under `src/`, not a placeholder. `trellis validate` counts files and lines of code against the limits.
- [tech/decisions/ADR-0001](tech/decisions/ADR-0001-zero-dependency-http-service.md) - why this service has zero npm dependencies, recorded with assumptions and review triggers instead of tribal knowledge.
- [quality/quality-gates.yaml](quality/quality-gates.yaml) - the gates `trellis audit` evaluates; enforced gates fail CI.
- [AGENTS.md](AGENTS.md) - canonical agent rules. `CLAUDE.md` and `.github/copilot-instructions.md` are thin pointers to it (single source of truth).
- [tests/contract.test.js](tests/contract.test.js) - contract tests that mirror the examples in the contracts, run with plain `node --test`.

## Run

Requires Node >= 18. No `npm install` needed (zero dependencies).

```bash
npm start   # serves on http://localhost:8080
```

```bash
curl http://localhost:8080/health
# {"ok":true}

curl -X POST http://localhost:8080/quote \
  -H 'content-type: application/json' \
  -d '{"destination":"DE","weight_kg":2,"method":"standard"}'
# {"amount":{"currency":"EUR","value":4.99},"estimated_days":3}

curl -X POST http://localhost:8080/quote \
  -H 'content-type: application/json' \
  -d '{"destination":"DE","weight_kg":99,"method":"standard"}'
# {"error":{"code":"INVALID_WEIGHT"}}

curl http://localhost:8080/zones
```

Pricing: standard is 2.99 EUR base + 1.00/kg (3 days), express is 7.99 EUR base + 2.00/kg (1 day).
DE is domestic; every other destination gets a +5.00 EUR international surcharge and +2 days.

## Test

```bash
node --test tests/
```

## Audit

The same checks CI runs:

```bash
git clone --depth 1 https://github.com/e-onux/trellis /tmp/trellis
cd /tmp/trellis && npm install
node /tmp/trellis/packages/cli/bin/trellis.js audit --root /path/to/trellis-example-app
node /tmp/trellis/packages/cli/bin/trellis.js validate --root /path/to/trellis-example-app
```

## License

Apache-2.0
