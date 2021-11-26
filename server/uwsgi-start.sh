#!/bin/bash
# Modeled closely after flask portion of amazon/aws-eb-python:3.4.2-onbuild-3.5.1 entrypoint script
. env/bin/activate
uwsgi --ini uwsgi.ini