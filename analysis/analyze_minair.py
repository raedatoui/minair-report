#!/usr/bin/env python3
"""Analyze a large Minair CSV and write an offline HTML report. Requires duckdb."""

import argparse
import csv
import json
import math
import shutil
import sys
import tempfile
from datetime import datetime, timezone
from itertools import groupby, islice
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

try:
    import duckdb
except ImportError:
    raise SystemExit("Install the project dependencies first: uv sync")


METRICS = {
    "aqi_2_5": ("PM2.5 AQI", "AQI"),
    "aqi_10_0": ("PM10 AQI", "AQI"),
    "pm_1_0": ("PM1.0", "µg/m³"),
    "pm_2_5": ("PM2.5", "µg/m³"),
    "pm_10_0": ("PM10", "µg/m³"),
    "temperature": ("Temperature", "°F"),
    "humidity": ("Humidity", "%"),
    "pressure": ("Pressure", "hPa"),
    **{f"um_count_{size}": (f"Particles ≥{size.replace('_', '.')} µm", "count/dL")
       for size in ("0_3", "0_5", "1_0", "2_5", "5_0", "10_0")},
}
HERE = Path(__file__).resolve().parent
EVENT_COLUMNS = """id, timestamp, CAST(recorded_at AS VARCHAR) AS recorded_at,
    aqi_2_5, aqi_10_0, pm_2_5, pm_10_0, temperature, humidity"""
MATCH_420 = "aqi_2_5 = 420 OR aqi_10_0 = 420"


def sql_string(value):
    return "'" + str(value).replace("'", "''") + "'"


def records(connection, query):
    result = connection.execute(query)
    names = [column[0] for column in result.description]
    return [dict(zip(names, row)) for row in result.fetchall()]


def export_csv(connection, query, path):
    connection.execute(f"COPY ({query}) TO {sql_string(path)} (HEADER, FORMAT CSV)")


def aggregates(threshold):
    fields = ["count(*) AS readings", "count(DISTINCT CAST(recorded_at AS DATE)) AS days_observed"]
    for name in METRICS:
        fields.extend(f"{function}({name}) AS {name}_{suffix}"
                      for function, suffix in (("count", "count"), ("avg", "mean"),
                                                ("min", "min"), ("max", "max")))
    fields.extend([
        "approx_quantile(aqi_2_5, 0.5) AS aqi_2_5_median",
        "approx_quantile(aqi_2_5, 0.95) AS aqi_2_5_p95",
        f"count(*) FILTER (WHERE aqi_2_5 > {threshold}) AS spike_readings",
        f"count(*) FILTER (WHERE {MATCH_420}) AS matches_420",
    ])
    return ",\n".join(fields)


def import_csv(connection, source):
    casts = ", ".join(f"try_cast({name} AS DOUBLE) AS {name}" for name in METRICS)
    connection.execute(f"""
        CREATE TABLE parsed AS
        SELECT id, try_cast(timestamp AS DOUBLE) AS timestamp, {casts}
        FROM read_csv(?, header=true, all_varchar=true, nullstr=['', 'NULL'], strict_mode=true)
    """, [str(source)])
    clean = []
    for name in METRICS:
        condition = f"isfinite({name})"
        if name.startswith("aqi_"):
            condition += f" AND {name} >= 0"
        clean.append(f"CASE WHEN {condition} THEN {name} END AS {name}")
    connection.execute(f"""
        CREATE TABLE measurements AS
        SELECT id, CASE WHEN isfinite(timestamp) THEN timestamp END AS timestamp,
            CASE WHEN timestamp >= 0 AND timestamp < 4102444800
                AND timestamp = trunc(timestamp)
                THEN to_timestamp(timestamp) END AS recorded_at,
            {', '.join(clean)}
        FROM parsed
    """)
    connection.execute("DROP TABLE parsed")
    connection.execute("CREATE VIEW valid AS SELECT * FROM measurements WHERE recorded_at IS NOT NULL")


def analyze(connection, args, output):
    totals = records(connection, f"""
        SELECT {aggregates(args.spike_aqi)},
            CAST(min(recorded_at) AS VARCHAR) AS first_reading,
            CAST(max(recorded_at) AS VARCHAR) AS last_reading
        FROM valid
    """)[0]
    quality = records(connection, f"""
        SELECT count(*) AS source_rows,
            count(*) FILTER (WHERE recorded_at IS NULL) AS invalid_timestamps,
            count(*) FILTER (WHERE ({MATCH_420}) AND recorded_at IS NULL) AS undated_420,
            count(*) FILTER (WHERE {MATCH_420}) AS total_420
        FROM measurements
    """)[0]
    if not totals["readings"]:
        raise ValueError("No rows with valid Unix-second timestamps (1970–2099) were found.")

    # Groups and compact results stay small; raw records remain in DuckDB on disk.
    connection.execute(f"""
        CREATE TABLE monthly AS
        SELECT strftime(recorded_at, '%Y-%m') AS month, {aggregates(args.spike_aqi)}
        FROM valid GROUP BY 1
    """)
    monthly = records(connection, "SELECT * FROM monthly ORDER BY month")
    export_csv(connection, "SELECT * FROM monthly ORDER BY month", output / "monthly.csv")
    metric_summary = [
        {"metric": name, "label": label, "unit": unit,
         **{key: totals[f"{name}_{key}"] for key in ("count", "mean", "min", "max")}}
        for name, (label, unit) in METRICS.items()
    ]
    categories = records(connection, """
        SELECT CASE WHEN aqi_2_5 <= 50 THEN 0 WHEN aqi_2_5 <= 100 THEN 1
            WHEN aqi_2_5 <= 150 THEN 2 WHEN aqi_2_5 <= 200 THEN 3
            WHEN aqi_2_5 <= 300 THEN 4 ELSE 5 END AS band, count(*) AS readings
        FROM valid WHERE aqi_2_5 IS NOT NULL GROUP BY 1 ORDER BY 1
    """)
    spikes = f"""SELECT {EVENT_COLUMNS} FROM valid WHERE aqi_2_5 > {args.spike_aqi}
        ORDER BY aqi_2_5 DESC, timestamp, id"""
    export_csv(connection, spikes, output / "spikes.csv")
    top_spikes = records(connection, spikes + " LIMIT 100")

    # Export every 420 match, including otherwise unusable timestamps.
    archive = f"""SELECT {EVENT_COLUMNS},
        aqi_2_5 = 420 AS pm25_match, aqi_10_0 = 420 AS pm10_match
        FROM measurements WHERE {MATCH_420} ORDER BY timestamp NULLS LAST, id"""
    export_csv(connection, archive, output / "420.csv")
    return {
        "source": args.csv.name,
        "generated": datetime.now(timezone.utc).isoformat(),
        "timezone": args.timezone,
        "spike_threshold": args.spike_aqi,
        "totals": totals,
        "quality": quality,
        "metrics": metric_summary,
        "monthly": monthly,
        "categories": categories,
        "spikes": top_spikes,
    }


def render_report(data):
    template = (HERE / "minair-analysis.html").read_text(encoding="utf-8")
    # Prevent a CSV filename or identifier from terminating the JSON script tag.
    encoded = json.dumps(data, ensure_ascii=False, allow_nan=False, separators=(",", ":"))
    safe_json = encoded.replace("&", "\\u0026").replace("<", "\\u003c").replace(">", "\\u003e")
    return template.replace('<script id="report-data" type="application/json">null</script>',
                            f'<script id="report-data" type="application/json">{safe_json}</script>')


def export_spike_groups(source, app_output):
    """Page the complete, AQI-sorted spike export for expandable React rows."""
    output = app_output / "spikes"
    output.mkdir(parents=True, exist_ok=True)
    groups = []
    numeric_fields = ("timestamp", "aqi_2_5", "aqi_10_0", "pm_2_5", "pm_10_0", "temperature", "humidity")
    with source.open(newline="", encoding="utf-8") as handle:
        for aqi, readings in groupby(csv.DictReader(handle), key=lambda row: float(row["aqi_2_5"])):
            folder = output / f"aqi-{aqi}"
            folder.mkdir(exist_ok=True)
            count = 0
            page = 1
            while batch := list(islice(readings, 100)):
                rows = []
                for record in batch:
                    row = {name: record[name] or None for name in ("id", "recorded_at")}
                    row.update({name: float(record[name]) if record[name] else None for name in numeric_fields})
                    rows.append(row)
                (folder / f"page-{page}.json").write_text(
                    json.dumps({"rows": rows}, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8")
                count += len(rows)
                page += 1
            groups.append({"aqi": aqi, "count": count, "path": f"spikes/{folder.name}"})
    (output / "index.json").write_text(
        json.dumps(groups, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8")


def write_reports(connection, data, output, app_output):
    (output / "summary.json").write_text(json.dumps(data, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8")
    (output / "index.html").write_text(render_report(data), encoding="utf-8")
    app_output.mkdir(parents=True, exist_ok=True)
    if app_output != output:
        for name in ("summary.json", "monthly.csv", "spikes.csv", "420.csv"):
            shutil.copyfile(output / name, app_output / name)
    export_spike_groups(output / "spikes.csv", app_output)
    total = data["quality"]["total_420"]
    if not total:
        return
    archive_dir = output / "420"
    archive_dir.mkdir(exist_ok=True)
    app_archive_dir = app_output / "420"
    app_archive_dir.mkdir(exist_ok=True)
    result = connection.execute(f"""SELECT {EVENT_COLUMNS} FROM measurements
        WHERE {MATCH_420} ORDER BY timestamp NULLS LAST, id""")
    names = [column[0] for column in result.description]
    page = 1
    while batch := result.fetchmany(100):
        archive = {
            "archive_page": True, "page": page, "pages": math.ceil(total / 100),
            "total": total, "timezone": data["timezone"],
            "rows": [dict(zip(names, row)) for row in batch],
        }
        name = "index.html" if page == 1 else f"page-{page}.html"
        (archive_dir / name).write_text(render_report(archive), encoding="utf-8")
        (app_archive_dir / f"page-{page}.json").write_text(
            json.dumps(archive, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8")
        page += 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv", type=Path, help="Minair CSV with Unix-second timestamps")
    parser.add_argument("--output", type=Path, default=HERE / "analysis-report")
    parser.add_argument("--app-output", type=Path, default=HERE.parent / "client/public/data/history",
                        help="JSON/CSV staging directory for the app's /all-time report")
    parser.add_argument("--timezone", default="America/New_York", help="Timezone for month boundaries")
    parser.add_argument("--spike-aqi", type=float, default=150, help="Spikes have PM2.5 AQI strictly above this value")
    parser.add_argument("--memory-limit", default="512MB", help="DuckDB buffer limit; total process memory can be higher")
    args = parser.parse_args()
    args.csv = args.csv.expanduser().resolve()
    args.output = args.output.expanduser().resolve()
    args.app_output = args.app_output.expanduser().resolve()
    if not args.csv.is_file():
        parser.error(f"CSV not found: {args.csv}")
    if not math.isfinite(args.spike_aqi) or args.spike_aqi < 0:
        parser.error("--spike-aqi must be a finite, nonnegative number")
    try:
        ZoneInfo(args.timezone)
    except ZoneInfoNotFoundError:
        parser.error(f"Unknown timezone: {args.timezone}")
    if args.csv in [folder / name for folder in (args.output, args.app_output)
                    for name in ("monthly.csv", "spikes.csv", "420.csv")]:
        parser.error("The input CSV cannot also be one of the output files")

    args.output.mkdir(parents=True, exist_ok=True)
    work = HERE / "work"
    work.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="minair-analysis-", dir=work) as scratch:
        with duckdb.connect(str(Path(scratch) / "readings.duckdb")) as connection:
            connection.execute(f"SET memory_limit = {sql_string(args.memory_limit)}")
            connection.execute("SET threads = 2")
            connection.execute("SET preserve_insertion_order = false")
            connection.execute(f"SET temp_directory = {sql_string(Path(scratch) / 'spill')}")
            connection.execute(f"SET TimeZone = {sql_string(args.timezone)}")
            print(f"Importing {args.csv.name} ({args.csv.stat().st_size / 1e9:.2f} GB)…", flush=True)
            import_csv(connection, args.csv)
            print("Calculating monthly averages, peaks, and the 420 archive…", flush=True)
            data = analyze(connection, args, args.output)
            write_reports(connection, data, args.output, args.app_output)
    print(f"Report: {args.output / 'index.html'}")
    print(f"App data: {args.app_output} (upload to gs://www.minair.me/data/history/ for /all-time)")
    print(f"{data['totals']['readings']:,} dated readings; {data['quality']['total_420']:,} exact 420 matches.")


if __name__ == "__main__":
    try:
        main()
    except (duckdb.Error, OSError, ValueError) as error:
        print(f"Analysis failed: {error}", file=sys.stderr)
        sys.exit(1)
