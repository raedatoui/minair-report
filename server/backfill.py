"""Backfill sensor data"""

# regex for search for points textPayload =~ "('pm2.5_a':)( 6\d{1})\w+" // 600+
import os
from dotenv import load_dotenv

load_dotenv()

SENSOR_DB_URL = os.environ.get('SENSOR_DB_URL')

from sensor.logic import sensor

pt = {'api_version': 'V1.0.6-0.0.9', 'time_stamp': 1622500921, 'sensor': {'sensor_index': 87629, 'name': 'Clinton Hill Coops', 'model': 'PA-I', 'location_type': 1, 'latitude': 40.6877, 'longitude': -73.9675, 'altitude': 96, 'last_seen': 1622500917, 'last_modified': 1614109317, 'private': 0, 'channel_state': 1, 'channel_flags_manual': 0, 'humidity_a': 21, 'temperature_a': 87.0, 'pressure_a': 1018.22, 'pm1.0_a': 234.88, 'pm2.5_a': 1563.65, 'pm10.0_a': 4036.72, '0.3_um_count_a': 37607.24, '0.5_um_count_a': 22085.18, '1.0_um_count_a': 15307.59, '2.5_um_count_a': 7084.06, '5.0_um_count_a': 3144.99, '10.0_um_count_a': 2549.35, 'stats_a': {'pm2.5': 1563.65, 'pm2.5_10minute': 341.21, 'pm2.5_30minute': 157.53, 'pm2.5_60minute': 89.2, 'pm2.5_6hour': 26.38, 'pm2.5_24hour': 17.23, 'pm2.5_1week': 11.13, 'time_stamp': 1622500917}, 'analog_input': 0.02, 'primary_id_a': 1215670, 'primary_key_a': 'M1ITKOR6BTNYU2TC', 'secondary_id_a': 1215671, 'secondary_key_a': '3QU6ZPYG6XUA4X23', 'primary_id_b': 1215672, 'primary_key_b': 'SR7GUM6W6C3L51AV', 'secondary_id_b': 1215673, 'secondary_key_b': 'THJIGGP85BQS2VT5', 'hardware': '2.0+BME280+PMSX003-A', 'led_brightness': 15.0, 'firmware_upgrade': '6.01', 'firmware_version': '6.01', 'rssi': -43.0, 'icon': 0, 'channel_flags_auto': 0}}
sensor.save(pt['sensor'])
