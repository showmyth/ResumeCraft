// Extracted from middleware/auth.js's checkAICredits so the reset
// decision is unit-testable without needing a DB connection, and so
// the invalid-date edge case is handled explicitly rather than by
// accident.
//
// Edge case this guards against: if `lastResetDate` is ever missing,
// null, or otherwise unparseable (e.g. a document written outside
// Mongoose's schema defaults, or corrupted data), `new Date(bad value)`
// produces an Invalid Date, whose `.getMonth()`/`.getFullYear()` both
// return NaN. Comparing `now.getMonth() !== NaN` is ALWAYS true (NaN
// never equals anything, even itself), which would make the naive
// version of this check reset credits on every single call for that
// user — silently giving them unlimited resets. We treat an invalid
// date as "definitely needs a reset" (safe default — a real reset
// date gets written immediately after), but do it via an explicit
// validity check so the behavior is intentional and documented, not
// an accident of NaN comparison semantics.
export function shouldResetCredits(lastResetDate, now = new Date()) {
  const last = new Date(lastResetDate);
  if (isNaN(last.getTime())) return true; // no valid reset date on record — reset now
  return now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear();
}
