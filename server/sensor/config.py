"""Application configuration."""

import os

from dotenv import load_dotenv

# Service information
SERVICE_NAME = 'minair-report'
SERVICE_VERSION = '1.0.0'

load_dotenv()

SENSOR_DB_URL = os.environ.get('SENSOR_DB_URL')

# Generic handlers
HEALTH_CHECK = '/hello/'
