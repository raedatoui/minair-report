"""API utilities."""
import json
import flask


def flaskify(response, headers=None, encoder=None):
    """Format the response to be consumeable by flask.

    The api returns mostly JSON responses. The format method converts the dicts
    into a json object (as a string), and the right response is returned (with
    the valid mimetype, charset and status.)

    Args:
        response (Response): The dictionary object to convert into a json
            object. If the value is a string, a dictionary is created with the
            key "message".
        headers (dict): optional headers for the flask response.
        encoder (Class): The class of the encoder (if any).

    Returns:
        flask.Response: The flask response with formatted data, headers, and
            mimetype.
    """

    status_code = response.status
    data = response.errors or response.message

    mimetype = 'text/plain'
    if isinstance(data, list) or isinstance(data, dict):
        mimetype = 'application/json'
        data = json.dumps(data, cls=encoder)

    return flask.Response(
        response=data, status=status_code, headers=headers, mimetype=mimetype)


def underscore_to_camel(s):
    components = s.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


def convert_value(v):
    return convert_json(v) if (isinstance(v, dict) or isinstance(v, list)) else v


def convert_json(d):
    new_d = {}
    if isinstance(d, list):
        return [convert_value(v) for v in d]
    for k, v in d.items():
        new_d[underscore_to_camel(k)] = convert_value(v)
    return new_d
