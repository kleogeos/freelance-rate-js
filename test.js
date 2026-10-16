const assert = require("node:assert");
const { compute } = require("./index.js");

// Reference values cross-checked against the Python implementation
// (kleogeos/freelance-rate-cli, rate.py) to confirm numeric parity, not
// invented independently.
const cases = [
  {
    args: [60000, 25, 2000, 10, 4, 40, 70],
    expect: {
      hourly_rate: 67.11,
      revenue_needed_per_year: 90200,
      billable_hours_per_year: 1344,
      day_rate_8h: 536.9,
      project_10h: 671.13,
      project_40h: 2684.52,
    },
  },
  {
    args: [0, 25, 0, 10, 4, 40, 70],
    expect: {
      hourly_rate: 0,
      revenue_needed_per_year: 0,
      billable_hours_per_year: 1344,
      day_rate_8h: 0,
      project_10h: 0,
      project_40h: 0,
    },
  },
  {
    args: [50000, 90, 0, 0, 0, 40, 100],
    expect: {
      hourly_rate: 120.19,
      revenue_needed_per_year: 250000,
      billable_hours_per_year: 2080,
      day_rate_8h: 961.54,
      project_10h: 1201.92,
      project_40h: 4807.69,
    },
  },
  {
    args: [100000, 25, 5000, 15, 8, 30, 50],
    expect: {
      hourly_rate: 241.04,
      revenue_needed_per_year: 159083.33,
      billable_hours_per_year: 660,
      day_rate_8h: 1928.28,
      project_10h: 2410.35,
      project_40h: 9641.41,
    },
  },
];

let failures = 0;
for (const { args, expect } of cases) {
  const got = compute(...args);
  for (const key of Object.keys(expect)) {
    if (got[key] !== expect[key]) {
      failures++;
      console.error(`FAIL args=${JSON.stringify(args)} key=${key} got=${got[key]} want=${expect[key]}`);
    }
  }
}

// Edge cases: tax capped at 80%, billable capped at [1,100], weeks-off capped so weeks >= 1
assert.strictEqual(compute(1000, 999, 0, 0, 0, 40, 70).hourly_rate > 0, true, "extreme tax should not divide by zero/negative");
assert.strictEqual(compute(1000, 25, 0, 0, 100, 40, 70).billable_hours_per_year > 0, true, "weeks-off >= 52 should not produce zero/negative weeks");
assert.strictEqual(compute(1000, 25, 0, 0, 0, 40, 0).billable_hours_per_year > 0, true, "billable 0% should floor to 1%, not divide by zero");

if (failures > 0) {
  console.error(`\n${failures} assertion(s) failed`);
  process.exit(1);
}
console.log(`All ${cases.length} parity cases + 3 edge cases passed.`);
