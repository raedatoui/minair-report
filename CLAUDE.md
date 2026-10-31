# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Real-time indoor air quality dashboard for a PurpleAir sensor ("Minair", sensor index `87629`) in Brooklyn, plus a pile of fan content (songs, videos, erotic fiction) accumulated during pandemic-era Friday hangouts. Live at https://minair.me.

Three independent parts:

- `server/` — Flask app running on a Raspberry Pi at `192.168.1.14`, backed by MariaDB.
- `client/` — Next.js static-export app (React 19 + TypeScript 7 + Material UI 9 + Highcharts), deployed to Firebase Hosting.
- `analysis/` — Python 3.14 CSV analyzer and offline report template, managed with uv and Ruff.

## Commands

### Client (`cd client`, Node 24.22.2 per `.nvmrc`, pnpm 12.16.1)

```sh
nvm use
pnpm install --frozen-lockfile
pnpm dev          # Next.js development server on :3000; pnpm start is an alias
pnpm typecheck    # TypeScript compiler, without emitting files
pnpm build        # Next.js static export to out/
pnpm run deploy   # build, then deploy Hosting to the existing minair site
pnpm lint         # standalone Biome lint; never part of dev/build
```

`next.config.ts` uses `output: 'export'` and `trailingSlash: true`. Firebase Hosting
serves `out/` using `firebase.json` (site `minair`) and `.firebaserc` (project
`api-project-992432653598`). There is no runtime Node server or CRA asset
rewrite. The all-time report reads its JSON/CSV files from the GCS bucket at
`data/history/`. Local exports remain gitignored in `public/data/history/`; upload
them to `gs://www.minair.me/data/history/` when regenerating the report.

React, Next.js, Material UI, and TypeScript versions must be upgraded together with
their peer dependencies. pnpm is pinned in `packageManager`; use `pnpm-lock.yaml`.

### Analysis (`cd analysis`, Python 3.14)

```sh
uv sync --locked
uv run analyze_minair.py /absolute/path/to/readings.csv
uv run ruff check .
uv run ruff format .
```

Dependencies and Ruff configuration live in `pyproject.toml`; commit `uv.lock`.
The analyzer writes the offline report to `analysis-report/` and stages app data
in `../client/public/data/history/`. Upload generated data to the GCS bucket to
update `/all-time`. Source CSVs, reports, scratch data, and `.venv` are gitignored.

### Server (`cd server`)

```sh
make pip_dev      # create ./env venv + install requirements.txt
make dev          # env/bin/python3 dev.py — Flask debug server on :5000
make lint         # env/bin/flake8 sensor/  (flake8 is NOT in requirements.txt; pip install it separately)
make clean        # rm -rf env
./uwsgi-start.sh  # production: uwsgi via uwsgi.ini, unix socket /tmp/minair.sock
./stop.sh         # kills uwsgi
./cron.sh         # what the Pi's crontab runs every minute: curl .../api/save
```

Requires a gitignored `server/.env` with `SENSOR_DB_URL` (SQLAlchemy/PyMySQL URL) and `X_API_KEY` (PurpleAir), plus `storage-key.json` for GCS credentials.

Gotcha: `sensor/models/sensor_point.py` imports `deepdiff`, which is unused and missing from `requirements.txt`. The app won't import without it installed.

## Architecture

### The client does not call the server in production

This is the central thing to understand. `/api/save` is invoked once a minute by cron on the Pi. That single request:

1. Fetches the PurpleAir v1 API for sensor `87629`.
2. Maps PurpleAir field names → DB columns (`db_fields` in `logic/sensor_logic.py`), applies fixed calibration offsets (`humidity + 4`, `temperature - 8`), and computes EPA AQI + category from PM2.5/PM10 concentrations.
3. Inserts into the `measurement` table — but only if the timestamp differs from the latest row (`create_measurement` dedupes; if unchanged, everything below is skipped).
4. Recomputes windowed series (1h, 6h, 12h, 24h, 1week) and "percent of readings under threshold" trend summaries.
5. Uploads each as a JSON blob to `gs://www.minair.me/data/*.json` with `Cache-Control: no-store, max-age=0`.

The frontend then just fetches those static JSON files from `https://storage.googleapis.com/www.minair.me/data/` and re-polls every 30s (`useInterval` in `components/app.tsx`). The Flask API endpoints (`/api/current`, `/api/1hour`, …) exist and return the same data live, but are only used in local development.

To point the client at a local Flask server instead of the CDN, flip `const dev = false` → `true` in `client/src/constants.ts`. That one flag switches base URL, path segment (`data` → `api`), and the `.json` suffix for every route in `apiRoutes`.

### snake_case → camelCase boundary

The database and all Python code use snake_case. `convert_json()` in `sensor/utils/api_utils.py` recursively camelCases every key on the way out, for both API responses and the uploaded JSON blobs. So `pm_2_5` in the DB is `pm2_5` from `Measurement.to_dict()` and `pm25` in the TypeScript types. When adding a field, add it in the model's `to_dict()` and use the camelCased name in `client/src/types.ts`.

### Server layout

- `main.py` — creates `app` by importing `sensor.api`, then imports `sensor.handlers` purely for its route-registration side effects.
- `sensor/api.py` — the Flask app object. Imported by handlers and by `connectors/mysql.py` (for `teardown_request`), so it must stay import-cycle-free.
- `sensor/handlers.py` — every route, all thin. Each wraps its result in `responsify_and_flaskify_success`, which applies `convert_json` + the `Response` wrapper + the datetime `Encoder`. A catch-all `errorhandler(Exception)` maps `MinairError` / `HTTPException` / anything else to JSON error bodies, and `after_request` adds `Access-Control-Allow-Origin: *`.
- `sensor/logic/` — orchestration. `sensor_logic.py` holds the AQI math and the GCS upload; `content.py` is a passthrough to the content models.
- `sensor/models/` — SQLAlchemy declarative models, each with module-level query functions alongside (no repository layer). All DB access goes through the `purp_db_session()` contextmanager in `connectors/mysql.py`, which commits/rolls back for you.
- The `measurement` table's DDL lives as a docstring at the top of `models/sensor_point.py`; there are no migrations.

### Client layout

- `app/` — Next.js App Router pages and the persistent root layout. `[video]/page.tsx` statically generates the URLs in `content/videos.ts`.
- `components/app.tsx` — persistent app shell, live data polling, and shared audio state. Pages use `useMinair()` for data and actions. Browser APIs initialize in effects, never during server rendering.
- The AQI category index drives the root sky background declaratively. `useWhite` is derived from the same index and passed to the existing components. The history report keeps its opaque colors independently. The body glitch class is managed by an effect.
- `constants.ts` — the CDN base plus asset path prefixes (`/audio/`, `/videos/`, `/fans/`, `/logo/`, `/menu/`). All media lives in the GCS bucket; nothing large is in `public/`.
- `styles.ts` — shared Material UI theme, CSS rules, and typed `minair-*` class names. `app/providers.tsx` installs them with Emotion/Material UI GlobalStyles and the App Router cache provider. Components retain their existing `classes` props; there is no JSS or `withStyles`.
- `components/glitch/` — a self-contained three.js + GLSL effect (`.vs`/`.fs` files) that takes over the whole page when `showHeader` is false (triggered from the fiction page).

### Linting

Biome replaces the CRA ESLint integration. Run `pnpm lint` explicitly. It does not
block `pnpm dev` or `pnpm build`. Keep existing four-space indentation and single
quotes; avoid mass formatting unrelated code. `pnpm format` is an explicit opt-in.
