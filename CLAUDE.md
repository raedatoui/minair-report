# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Real-time indoor air quality dashboard for a PurpleAir sensor ("Minair", sensor index `87629`) in Brooklyn, plus a pile of fan content (songs, videos, erotic fiction) accumulated during pandemic-era Friday hangouts. Live at https://minair.me.

Two independent halves:

- `server/` — Flask app running on a Raspberry Pi at `192.168.1.14`, backed by MariaDB.
- `client/` — Create React App SPA (React 17 + TypeScript + Material-UI v4 + Highcharts), deployed to Firebase Hosting.

## Commands

### Client (`cd client`, Node 24.22.2 per `.nvmrc`, Yarn 1.22.22)

```sh
nvm use          # select the project's Node version
yarn install --frozen-lockfile
yarn start        # CRA dev server on :3000
yarn build        # runs ./build.sh (CRA build + index.html rewrite, see below)
yarn test         # react-scripts test (no test files exist yet)
npx eslint src --ext .ts,.tsx    # no lint script in package.json
```

React Scripts 5 provides Webpack 5. TypeScript stays on 4.9 for React Scripts compatibility;
React 17 and Material UI 4 retain the existing component APIs. Yarn Classic is pinned in `packageManager`.

`build.sh` stops if compilation fails, then uses Node to rewrite `/static/` → `https://www.minair.me/static/`
in `build/index.html`. Bundles are served from the GCS bucket, not from Firebase.

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

- `components/app.tsx` — all routing (react-router v5 `Switch`), all top-level data fetching, and the audio player state. The `/:id` catch-all route resolves against a hardcoded `videoList` map.
- The AQI category index drives the entire visual theme: `dataFrame.aqiIdx25` (0–7) indexes the `backgrounds` array and is written directly onto `document.getElementById('root').className` and `document.body.className`, bypassing React. `useWhite` (derived from the same index) is threaded through nearly every component as a prop to flip text color.
- `constants.ts` — the CDN base plus asset path prefixes (`/audio/`, `/videos/`, `/fans/`, `/logo/`, `/menu/`). All media lives in the GCS bucket; nothing large is in `public/`.
- `styles.ts` — a single shared MUI `styles` object; components receive it via `WithStyles<typeof styles>` rather than defining their own.
- `components/glitch/` — a self-contained three.js + GLSL effect (`.vs`/`.fs` files) that takes over the whole page when `showHeader` is false (triggered from the fiction page).

### ESLint

airbnb + airbnb-typescript + airbnb/hooks, with 4-space indent, `max-len` 150, and `@typescript-eslint/no-explicit-any` as an error. Note `curly: ["error", "multi"]` — single-statement `if` bodies are written without braces throughout.
