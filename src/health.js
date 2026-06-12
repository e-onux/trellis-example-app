// Capability: health-report (capabilities/health-report/contract.yaml)
// Reports service readiness from the server lifecycle state. The server sets
// state.ready = true once it is listening, so NOT_READY is a real state, not decoration.

/**
 * Report service health.
 * @param {{ready: boolean}} state server lifecycle state owned by src/server.js
 * @returns {{ok: true} | {error: {code: 'NOT_READY'}}}
 */
export function healthReport(state = {}) {
  if (state.ready !== true) {
    return { error: { code: 'NOT_READY' } };
  }
  return { ok: true };
}
