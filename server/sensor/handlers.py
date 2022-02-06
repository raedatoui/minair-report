"""Application Handlers.
"""

from flask import jsonify, request
from werkzeug.exceptions import HTTPException

from sensor import config
from sensor.api import app
from sensor.utils.api_utils import flaskify, convert_json
from sensor.utils import response
from sensor.utils.exceptions import MinairError
from sensor.utils.datetime_json_encoder import Encoder
from sensor.logic import sensor
from sensor.logic import content


def responsify_and_flaskify_success(message):
    """Wrap the return value with Response and flaskify."""
    return flaskify(response.Response(message=convert_json(message)), encoder=Encoder)


@app.route(config.HEALTH_CHECK, methods=['GET'])
def health():
    """Check the health of the application."""
    return jsonify({'status': 'ok'})


# content
@app.route('/')
def get_homepage():
    return responsify_and_flaskify_success({'works': True})

@app.route('/api/fiction')
def get_fiction():
    return responsify_and_flaskify_success(content.get_fiction())


@app.route('/api/media')
def get_media():
    return responsify_and_flaskify_success(content.get_media())


@app.route('/api/songs')
def get_songs():
    return responsify_and_flaskify_success(content.get_songs())


@app.route('/api/videos')
def get_videos():
    return responsify_and_flaskify_success(content.get_videos())


# sensor
@app.route('/api/save')
def save_data():
    df = sensor.save_measurement()
    return responsify_and_flaskify_success(df)


@app.route('/api/current')
def current_data():
    df = sensor.load_current2()
    return responsify_and_flaskify_success(df)


@app.route('/api/1hour')
def get_hour():
    return responsify_and_flaskify_success(sensor.get_trends(1))


@app.route('/api/6hour')
def get_6hour():
    return responsify_and_flaskify_success(sensor.get_trends(6))


@app.route('/api/12hour')
def get_12hour():
    return responsify_and_flaskify_success(sensor.get_trends(12))


@app.route('/api/24hour')
def get_24hour():
    return responsify_and_flaskify_success(sensor.get_trends(24))


@app.route('/api/1week')
def get_week():
    return responsify_and_flaskify_success(sensor.get_trends(24*7))


@app.route('/api/24htrends')
def get_day_trends():
    return responsify_and_flaskify_success(sensor.get_day())


@app.route('/api/1weektrends')
def get_week_trends():
    return responsify_and_flaskify_success(sensor.get_week())


@app.route('/api/high')
def get_all_high():
    param = request.args.get('param')
    count = request.args.get('count', 20)
    return responsify_and_flaskify_success(sensor.get_top(param, count))


@app.errorhandler(Exception)
def exception_handler(error):
    """Handle error when uncaught exception is raised.
    Default exception handler.

    Returns:
        flask.Response: A 500 response with JSON 'code' & 'message' payload.
    """
    print(error)
    message = (
        'The server encountered an internal error '
        'and was unable to complete your request.')

    if isinstance(error, MinairError):
        return flaskify(response.create_error_response(
            code='whatever-boring',
            message=error.message,
            status=error.status
        ))

    if isinstance(error, HTTPException):
        return flaskify(response.create_error_response(
            code=error.name,
            message=error.description,
            status=error.code
        ))
    return flaskify(response.create_fatal_response(message), encoder=Encoder)


@app.after_request
def after_request(resp):
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp
