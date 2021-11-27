import json
import requests
import math
from datetime import datetime
from sensor.utils.exceptions import MinairError
from sensor.models import sensor_point
from google.cloud import storage

client = storage.Client()
bucket = client.get_bucket('minair.me')

db_fields = {
    "humidity_a": "humidity",
    "pressure_a": "pressure",
    "temperature_a": "temperature",
    "pm1.0_a": "pm_1_0",
    "pm2.5_a": "pm_2_5",
    "pm10.0_a": "pm_10_0",
    "0.3_um_count_a": "um_count_0_3",
    "0.5_um_count_a": "um_count_0_5",
    "1.0_um_count_a": "um_count_1_0",
    "2.5_um_count_a": "um_count_2_5",
    "5.0_um_count_a": "um_count_5_0",
    "10.0_um_count_a": "um_count_10_0",
}

stats_fields = [
    "pm2.5",
    "pm2.5_10minute",
    "pm2.5_30minute",
    "pm2.5_60minute",
    "pm2.5_6hour",
    "pm2.5_24hour",
    "pm2.5_1week",
    "time_stamp"
]

X_API_KEY = '716D4201-7C46-11EB-8C3A-42010A800259'

SENSOR_ID = 87629

HEADERS = {
    'X-API-KEY': X_API_KEY,
    'Content-Type': 'application/json'
}

API_URL = 'https://api.purpleair.com/v1/sensors/{}'.format(SENSOR_ID)

DATE_FORMAT = '%m/%d/%Y %I:%M:%S %p'


def linear(aqi_high, aqi_low, conc_high, conc_low, concentration):
    conc = float(concentration)
    a = ((conc - conc_low) / (conc_high - conc_low)) * (aqi_high - aqi_low) + aqi_low
    return round(a)


def aqi_pm_25(conc):
    c = (math.floor(10 * conc)) / 10
    if 0 <= c < 12.1:
        aqi = linear(50, 0, 12, 0, c)
    elif 12.1 <= c < 35.5:
        aqi = linear(100, 51, 35.4, 12.1, c)
    elif 35.5 <= c < 55.5:
        aqi = linear(150, 101, 55.4, 35.5, c)
    elif 55.5 <= c < 150.5:
        aqi = linear(200, 151, 150.4, 55.5, c)
    elif 150.5 <= c < 250.5:
        aqi = linear(300, 201, 250.4, 150.5, c)
    elif 250.5 <= c < 350.5:
        aqi = linear(400, 301, 350.4, 250.5, c)
    elif 350.5 <= c < 500.5:
        aqi = linear(500, 401, 500.4, 350.5, c)
    else:
        aqi = linear(501, 600, 500.5, 3000, c)
    return aqi


def api_pm_10(conc):
    c = math.floor(conc)
    if 0 <= c < 55:
        aqi = linear(50, 0, 54, 0, c)
    elif 55 <= c < 155:
        aqi = linear(100, 51, 154, 55, c)
    elif 155 <= c < 255:
        aqi = linear(150, 101, 254, 155, c)
    elif 255 <= c < 355:
        aqi = linear(200, 151, 354, 255, c)
    elif 355 <= c < 425:
        aqi = linear(300, 201, 424, 355, c)
    elif 425 <= c < 505:
        aqi = linear(400, 301, 504, 425, c)
    elif 505 <= c < 605:
        aqi = linear(500, 401, 604, 505, c)
    else:
        aqi = c

    return aqi


def aqi_cat(aqi):
    if aqi <= 50:
        aqi_category = "Good"
        cat_idx = 0
    elif 50 < aqi <= 100:
        aqi_category = "Moderate"
        cat_idx = 1
    elif 100 < aqi <= 150:
        aqi_category = "Unhealthy for Sensitive Groups"
        cat_idx = 2
    elif 150 < aqi <= 200:
        aqi_category = "Unhealthy"
        cat_idx = 3
    elif 200 < aqi <= 300:
        aqi_category = "Very Unhealthy"
        cat_idx = 4
    elif 300 < aqi <= 400:
        aqi_category = "Hazardous"
        cat_idx = 5
    elif 400 < aqi <= 500:
        aqi_category = "Hazardous"
        cat_idx = 6
    else:
        aqi_category = "Out of Range"
        cat_idx = 7
    return aqi_category, cat_idx


def format_date(v):
    return datetime.fromtimestamp(v).strftime(DATE_FORMAT)


def load_current2():
    return sensor_point.latest()


def save_measurement():
    r = requests.get(API_URL, headers=HEADERS)
    print(r.status_code)
    data = r.json()
    sensor = data['sensor']
    m = save(sensor)
    upload_file('current.json', sensor_point.latest())
    upload_file('1hour.json', sensor_point.get_trends(1))
    upload_file('6hour.json', sensor_point.get_trends(6))
    upload_file('24hour.json', sensor_point.get_trends(24))
    upload_file('1week.json', sensor_point.get_trends(168))
    return m


def save(pt):
    o = dict()
    for k in db_fields.keys():
        o[db_fields[k]] = pt[k]

    o['humidity'] = o['humidity'] + 4
    o['temperature'] = o['temperature'] - 8
    o['timestamp'] = pt['last_seen']

    o['aqi_2_5'] = aqi_pm_25(o['pm_2_5'])
    c, i = aqi_cat(o['aqi_2_5'])
    o['aqi_cat_2_5'] = c
    o['aqi_idx_2_5'] = i

    o['aqi_10_0'] = api_pm_10(o['pm_10_0'])
    d, i = aqi_cat(o['aqi_10_0'])
    o['aqi_cat_10_0'] = c
    o['aqi_idx_10_0'] = i

    formatted_stats = dict()
    for k, v in pt['stats_a'].items():
        if k != 'time_stamp':
            aqi = aqi_pm_25(v)
            c, i = aqi_cat(aqi)
            k = k.replace('2.5', '25')
            formatted_stats[k] = {
                'value': v,
                'aqi': aqi,
                'cat': c,
                'cat_idx': i
            }
    o['stats'] = formatted_stats
    m = sensor_point.create_measurement(o)
    return m


def get_trends(count):
    return sensor_point.get_trends(count)


def get_top(param, count):
    valid_fields = [db_fields[k] for k in db_fields.keys()]
    if param not in valid_fields:
        raise MinairError.bad_request('incorrect param for all time high')
    return sensor_point.get_top(param, count)


def get_day(day):
    return sensor_point.get_by_date(day)


def upload_file(filename, content):
    blob = bucket.blob('data/{}'.format(filename))
    blob.upload_from_string(json.dumps(content))