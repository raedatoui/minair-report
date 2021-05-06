"""Application Handlers.
"""

from flask import jsonify, render_template, request, send_from_directory
from werkzeug.exceptions import HTTPException

from sensor import config
from sensor.api import app
from sensor.utils.api_utils import flaskify, convert_json
from sensor.utils import response
from sensor.utils.datetime_json_encoder import Encoder
from sensor.logic import sensor
from sensor.logic import fans


def responsify_and_flaskify_success(message):
    """Wrap the return value with Response and flaskify."""
    return flaskify(response.Response(message=convert_json(message)), encoder=Encoder)


@app.route('/')
@app.route('/current')
@app.route('/fans')
@app.route('/fiction')
@app.route('/trends')
@app.route('/songs')
def index():
    return render_template('index.html')


@app.route('/media/<path:path>')
def send_static_file(path):
    return send_from_directory('static', 'media/{}'.format(path))


@app.route('/favicon.ico')
@app.route('/favicon')
def send_faviocn():
    return send_from_directory('static/', 'favicon.ico')


@app.route('/robots.txt')
def send_robots():
    return send_from_directory('static/', 'robots.txt')


@app.route(config.HEALTH_CHECK, methods=['GET'])
def health():
    """Check the health of the application."""
    return jsonify({'status': 'ok'})


@app.route('/api/current')
def current_data():
    df = sensor.load_current2()
    return responsify_and_flaskify_success(df)


@app.route('/api/save')
def save_data():
    df = sensor.save_measurement()
    return responsify_and_flaskify_success(df)


@app.route('/api/fiction')
def get_fiction():
    return responsify_and_flaskify_success(fans.get_fiction())


@app.route('/api/media')
def get_media():
    return responsify_and_flaskify_success(fans.get_media())


@app.route('/api/trends')
def get_hour():
    count = request.args.get('count')
    return responsify_and_flaskify_success(sensor.get_trends(count))


@app.route('/api/songs')
def get_songs():
    return responsify_and_flaskify_success(fans.get_songs())


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

    if isinstance(error, HTTPException):
        return flaskify(response.create_error_response(
            code=error.name,
            message=error.description,
            status=error.code
        ))
    return flaskify(response.create_fatal_response(message), encoder=Encoder)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
