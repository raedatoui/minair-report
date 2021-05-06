"""Application.

The API application is a `flask` application. It provides simple features such
as registering a url for a specific handlers.
"""


from flask import Flask

from sensor import config

app = Flask(config.SERVICE_NAME, template_folder='static', static_folder='static')

