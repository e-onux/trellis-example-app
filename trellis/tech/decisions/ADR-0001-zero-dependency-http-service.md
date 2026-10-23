# ADR-0001: Serve HTTP with the Node standard library

> Why this service has zero npm dependencies. Read this before reaching for `npm install`.

```yaml
id: ADR-0001
title: Serve HTTP with the Node standard library
status: accepted
date: 2026-06-12

context:
  description: >
    shipping-quotes is a small worked example: three capabilities, three JSON endpoints,
    no middleware, no templating, no database. A web framework would add a dependency tree
    to audit and upgrade for routing logic that fits in one small file. The example also
    needs to demonstrate that Trellis budgets measure real source files, which is clearest
    when the entire service is a handful of files with no vendored code.

decision:
  selected: Use node:http from the Node standard library (Node >= 18, ESM) with hand-rolled routing in src/server.js. No npm dependencies.

alternatives:
  - express
  - fastify

assumptions:
  - The service stays at a handful of JSON endpoints with trivial routing needs.
  - Node 18+ is available everywhere the service runs and is tested.
  - Contributors accept slightly more verbose request handling in exchange for zero dependency maintenance.

consequences:
  positive:
    - Zero dependencies to audit, patch or upgrade; npm install is a no-op.
    - Capability budgets measure exactly the code we wrote, nothing vendored.
    - Cold start and install time are as small as they can be.
  negative:
    - Routing, body parsing and content negotiation are hand-rolled and grow linearly with endpoints.
    - No middleware ecosystem; cross-cutting concerns (auth, logging) would need an ADR and a design.

review:
  interval: 12 months
  next_review: 2027-06-12
  triggers:
    - the service needs more than ~10 routes or non-trivial middleware
    - request parsing bugs traced to the hand-rolled HTTP layer
    - a framework becomes a platform requirement

affected_capabilities:
  - calculate-shipping-quote
  - resolve-destination-zone
  - health-report

migration:
  required: false

rollback:
  available: true
```

## Notes

If a trigger fires, supersede this ADR with a new one (do not delete it) and record the framework
choice with its own assumptions and review triggers.
