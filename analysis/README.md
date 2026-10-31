# Minair analysis

A Python 3.14 project managed with [uv](https://docs.astral.sh/uv/), with Ruff
configured in `pyproject.toml`. DuckDB processes the large sensor CSV on disk;
Python receives aggregates and small batches. The analyzer produces CSV and JSON
exports for the client's `/all-time` page.

## Run

From the repository root:

```sh
cd analysis
uv sync --locked
uv run analyze_minair.py /absolute/path/to/readings.csv
```

uv manages the project's `.venv`, DuckDB, and Ruff. `.python-version` selects
Python 3.14; `uv.lock` records resolved dependency versions. The old standalone
`requirements-analysis.txt` is replaced by `pyproject.toml`.

Optional settings:

```sh
uv run analyze_minair.py /absolute/path/to/readings.csv \
  --timezone America/New_York \
  --spike-aqi 150 \
  --memory-limit 512MB \
  --output analysis-report
```

The default output is `analysis/analysis-report/`, regardless of the current
working directory. `--output` selects another export directory. The source CSV
is read only and is imported again on each run.

## Client data

Each run stages JSON/CSV files in `client/public/data/history/` at the repository
root. Override this location with `--app-output /absolute/path/to/staging`.
The live client reads these files from Google Cloud Storage; generating them
locally does not update the live report. Upload them after regenerating:

```sh
gcloud storage cp --recursive \
  ../client/public/data/history/summary.json \
  ../client/public/data/history/spikes \
  ../client/public/data/history/420 \
  gs://www.minair.me/data/history/ \
  --content-type=application/json --cache-control=no-cache

gcloud storage cp ../client/public/data/history/*.csv \
  gs://www.minair.me/data/history/ \
  --content-type=text/csv --content-disposition=attachment --cache-control=no-cache
```

The `/all-time` page is reached through the Trends menu icon. It loads
`summary.json` and fetches spike and 420 archive pages on demand, 100 readings per
page. The greatest hits table groups readings into AQI bands and exact PM2.5 AQI
values; `spikes/index.json` lists the value groups, with raw readings in
`spikes/aqi-<value>/page-<number>.json`. Counts cover every qualifying reading,
including repeated source rows. The browser never reads the large source CSV.

Raw CSV files, generated reports, scratch databases, and virtual environments are
gitignored. Keep the source CSV outside the repository. The existing CSV, old
virtual environment, and previously generated reports beside the repo are not
moved by this migration.

## Development

Ruff's lint and format settings live in `pyproject.toml`. Run these when needed:

```sh
uv run ruff check .
uv run ruff format .
```

After changing dependencies, use `uv lock` to update `uv.lock` and `uv sync` to
update the environment. Commit both `pyproject.toml` and `uv.lock`.

## Outputs

- `monthly.csv`: count, average, minimum, and maximum for each numeric sensor
  metric; observed days; approximate PM2.5 median/p95; spike and 420 counts.
- `spikes.csv`: every qualifying PM2.5 spike, highest first.
- `420.csv`: every reading where **either AQI column equals exactly 420**.
- `summary.json`: monthly and all-time statistics, AQI category shares, and the
  top 100 spikes.

The app staging directory also contains `spikes/index.json`, paginated readings
in `spikes/aqi-<value>/page-<number>.json`, and `420/page-<number>.json`. Each page
holds up to 100 readings; a row matching both AQI columns at 420 appears once.

Output files with the same names are replaced on subsequent runs; use new
`--output` and `--app-output` directories to keep each run.

The default timezone follows the backend's US Eastern setting. A spike is one
recorded **PM2.5 AQI strictly above 150**, not a detected episode or a statistical
anomaly. Set `--spike-aqi` to use another threshold. Consecutive high readings
are kept individually, without assuming a sampling interval.

The memory setting controls DuckDB's buffer manager, not total process memory.
The analyzer uses two worker threads and disk spilling. Keep a few GB free for
the temporary database, sorting, and exports. Temporary files live in
`analysis/work/` and are removed when the run finishes, including normal error
exits.

## Meaning and limitations

- Expected headers are the ones in the supplied export: `id`, `timestamp`,
  `humidity`, `temperature`, `pressure`, the three `pm_*` fields, both `aqi_*`
  numeric values, and all six `um_count_*` fields. Extra category/index columns
  and `stats` are ignored. CSV syntax errors stop the import, rather than silently
  dropping malformed records.
- Timestamps are whole Unix **seconds** from 1970 through 2099. Millisecond
  timestamps are not auto-converted. Invalid timestamps are excluded from dated
  analysis and counted; their exact 420 matches still enter the archive.
- Every source row has equal weight. Averages are **sample-weighted**, not
  time-weighted. Duplicates are retained. Sensor downtime and uneven sampling
  can bias comparisons; observed-day counts do not measure uptime. Missing
  months appear as gaps, without interpolation.
- Empty/NULL, nonnumeric, and nonfinite measurements are excluded independently
  for each metric. Negative AQI is excluded; other finite values are preserved.
  The report lists valid and missing/invalid sample counts for dated rows.
- Temperature stays in °F. Pressure is labeled hPa, particulate mass µg/m³, and
  particle counts count/dL, following the PurpleAir source conventions.
- AQI averages summarize the recorded values. AQI is not recomputed from
  concentrations or updated to a new breakpoint standard. Category shares use
  numeric PM2.5 AQI bands (0–50, >50–100, >100–150, >150–200, >200–300, >300),
  rather than trusting the CSV's category strings or indices.
- Median and p95 use DuckDB's approximate quantiles to avoid collecting all
  observations in Python. Means, counts, minima, and maxima use all valid samples.

Implementation reference: [DuckDB CSV reader](https://duckdb.org/docs/stable/data/csv/overview)
and [larger-than-memory processing](https://duckdb.org/docs/stable/guides/performance/how_to_tune_workloads).
