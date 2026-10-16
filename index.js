#!/usr/bin/env node
"use strict";

function compute(net, taxPct, expenses, bufferPct, weeksOff, hoursPerWeek, billablePct) {
  const tax = Math.min(taxPct, 80) / 100;
  const gross = (net / (1 - tax) + expenses) * (1 + bufferPct / 100);
  const weeks = Math.max(52 - weeksOff, 1);
  const billableHours = (weeks * hoursPerWeek * Math.min(Math.max(billablePct, 1), 100)) / 100;
  const rate = gross / billableHours;
  const round2 = (n) => Math.round(n * 100) / 100;
  return {
    hourly_rate: round2(rate),
    revenue_needed_per_year: round2(gross),
    billable_hours_per_year: round2(billableHours),
    day_rate_8h: round2(rate * 8),
    project_10h: round2(rate * 10),
    project_40h: round2(rate * 40),
  };
}

function parseArgs(argv) {
  const defaults = {
    net: null,
    tax: 25,
    expenses: 0,
    buffer: 10,
    "weeks-off": 4,
    "hours-per-week": 40,
    billable: 70,
    json: false,
  };
  const out = { ...defaults };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") {
      out.json = true;
      continue;
    }
    if (a === "--help" || a === "-h") {
      out.help = true;
      continue;
    }
    const m = a.match(/^--([a-z-]+)$/);
    if (m && Object.prototype.hasOwnProperty.call(defaults, m[1])) {
      const key = m[1];
      const val = argv[++i];
      out[key] = Number(val);
    }
  }
  return out;
}

function printHelp() {
  console.log(`freelance-rate - calculate the hourly rate you need to charge as a freelancer

Usage: freelance-rate --net <amount> [options]

Options:
  --net <n>               Target take-home income per year (required)
  --tax <pct>             Tax rate, percent (default 25)
  --expenses <n>          Business expenses per year (default 0)
  --buffer <pct>          Safety buffer, percent (default 10)
  --weeks-off <n>         Unpaid weeks off per year (default 4)
  --hours-per-week <n>    Working hours per week (default 40)
  --billable <pct>        Percent of hours that are billable (default 70)
  --json                  Output as JSON
  -h, --help              Show this help

Run without installing:
  npx github:kleogeos/freelance-rate-js --net 60000
`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.net === null || Number.isNaN(args.net)) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const r = compute(
    args.net,
    args.tax,
    args.expenses,
    args.buffer,
    args["weeks-off"],
    args["hours-per-week"],
    args.billable
  );

  if (args.json) {
    console.log(JSON.stringify(r, null, 2));
    return;
  }

  console.log(`You should charge at least $${r.hourly_rate.toFixed(2)} / hour\n`);
  console.log(`Revenue needed per year   ${r.revenue_needed_per_year.toLocaleString()}`);
  console.log(`Billable hours per year   ${r.billable_hours_per_year.toLocaleString()}`);
  console.log(`Day rate (8h)             ${r.day_rate_8h.toLocaleString()}`);
  console.log(`10-hour project           ${r.project_10h.toLocaleString()}`);
  console.log(`40-hour project           ${r.project_40h.toLocaleString()}`);
}

module.exports = { compute };

if (require.main === module) {
  main();
}
