# AGENTS.md

> Canonical agent instructions for this repository. All other agent files (`CLAUDE.md`,
> `.github/copilot-instructions.md`) are thin pointers to this one. Do not duplicate rules into them.

This repository follows the **Trellis** standard (profile: `backend`, preset: `standard`).
Standard and CLI: https://github.com/e-onux/trellis

## Rules

1. Capability-first - every feature maps to a capability contract under `trellis/capabilities/`.
2. Done is more than code written - contract + examples + passing tests + budgets respected + current ADRs.
3. Budgets are hard limits - if a change fits the contract's `does` and stays within budget, extend it; if it would exceed a budget, STOP and write a split proposal first.
4. Obligation to NOT write code - on a stop condition, produce a split/refactor/ADR/migration proposal instead of more code.
5. Decisions are conditional - ADRs in `trellis/tech/decisions/` carry assumptions and review triggers; supersede, never delete.
6. No new dependency without an ADR - this service is zero-dependency by decision (ADR-0001).
7. Single source of truth - never duplicate rules across agent adapter files.
8. The repository is the memory - persist decisions and contracts in the repo, not in chat.

## Where things live

- Capability contracts: `trellis/capabilities/<id>/contract.yaml`. Budgets measure the real source files listed under each contract's `implementation:` key (paths are relative to the repo root, e.g. `src/quote.js`).
- Architecture decisions: `trellis/tech/decisions/` (index in `trellis/tech/decisions/index.md`).
- Quality gates: `trellis/quality/quality-gates.yaml`, evaluated by `trellis audit`.
- Source code: `src/` - one module per capability, wired together by `src/server.js` (wiring only, no business rules).
- Tests: `tests/` - run with `node --test tests/`. Each test mirrors a contract example; change them together.

## Stop conditions

Stop and propose instead of coding when:

- a change would push a capability over any budget in its contract,
- a change needs a new npm dependency (ADR required first),
- a change does not fit any capability's `responsibility.does` (new contract required first).
