# Project Constitution

> The highest-priority, slow-to-change rules for this repository. An agent may not violate these without an
> explicit, human-approved change to this file. Keep it short; everything here must earn its place.

1. Every feature is a **capability contract**. No contract under `capabilities/`, no feature.
2. **No new dependency without an ADR.** This service ships with zero npm dependencies (ADR-0001); adding one is an architecture decision, not a convenience.
3. **Budget exceeded means split proposal first.** When a change would push a capability over any budget in its contract, no code is written until a split/refactor proposal exists.
4. Contract examples and the tests in `tests/` are one artifact in two files - they change in the same commit or not at all.

_Amend via a PR that updates this file and explains the change. Amendments are rare and deliberate._
