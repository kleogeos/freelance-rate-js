# freelance-rate-js

[![test](https://github.com/kleogeos/freelance-rate-js/actions/workflows/test.yml/badge.svg)](https://github.com/kleogeos/freelance-rate-js/actions/workflows/test.yml)

Calculate the hourly rate you need to charge as a freelancer. Zero
dependencies — a direct Node.js port of
[freelance-rate-cli](https://github.com/kleogeos/freelance-rate-cli) (Python),
for people who reach for `npx` instead of `pip`.

Numeric output is cross-checked against the Python version (see `test.js`)
— both implement the same formula and return identical results.

## Run without installing

```bash
npx github:kleogeos/freelance-rate-js --net 60000
```

No npm account, no registry publish, no global install — `npx` clones the
repo and runs it directly.

## Usage

```bash
npx github:kleogeos/freelance-rate-js --net 60000 --expenses 2000
```

```
You should charge at least $67.11 / hour

Revenue needed per year   90,200
Billable hours per year   1,344
Day rate (8h)             536.9
10-hour project           671.13
40-hour project           2,684.52
```

### Options

| Flag | Default | Meaning |
|---|---|---|
| `--net <n>` | required | Target take-home income per year |
| `--tax <pct>` | 25 | Tax rate, percent |
| `--expenses <n>` | 0 | Business expenses per year |
| `--buffer <pct>` | 10 | Safety buffer, percent |
| `--weeks-off <n>` | 4 | Unpaid weeks off per year |
| `--hours-per-week <n>` | 40 | Working hours per week |
| `--billable <pct>` | 70 | Percent of hours that are billable |
| `--json` | off | Output as JSON |

## Install locally (optional)

```bash
git clone https://github.com/kleogeos/freelance-rate-js.git
cd freelance-rate-js
npm link   # makes `freelance-rate` available globally
```

## Tests

```bash
npm test
```

## Where this fits

Part of a small set of zero-dependency freelancer tools, including a growing
pair of `npx`-runnable ports: [freelance-invoice-js](https://github.com/kleogeos/freelance-invoice-js)
(invoice generator, same `npx github:...` pattern). Also:
[freelance-rate-cli](https://github.com/kleogeos/freelance-rate-cli) (Python,
same calculator), [freelance-invoice-cli](https://github.com/kleogeos/freelance-invoice-cli),
and the rest at [kleogeos.github.io/freelancer-tools](https://kleogeos.github.io/freelancer-tools/).

## License

MIT
