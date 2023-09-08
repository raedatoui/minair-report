"""JSON encoder that converts datetime and date objects."""

import datetime

import json

from sensor.utils import api_utils


class Encoder(json.JSONEncoder):
    """Encoder class to convert datetime and date objects."""

    def default(self, obj):
        """Return a default encoder method implementation."""
        if isinstance(obj, datetime.datetime):
            return api_utils.utc_format_with_z(obj)
        if isinstance(obj, datetime.date):
            return api_utils.utc_format(obj)
        return json.JSONEncoder.default(self, obj)
