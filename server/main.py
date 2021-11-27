"""Application."""
from flask import Flask
from sensor import api
from sensor import handlers  # noqa

app = api.app
