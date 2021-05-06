

ERROR_CODE_NOT_FOUND = 'not_found_error'
ERROR_CODE_INTERNAL_ERROR = 'internal_error'

CONTINUE = 100
PROCESSING = 102

OK = 200
CREATED = 201
ACCEPTED = 202
NON_AUTHORITATIVE = 203
NO_CONTENT = 204
RESET_CONTENT = 205
PARTIAL_CONTENT = 206
MULTIPLE_STATUS = 207
ALREADY_REPORTED = 208

BAD_REQUEST = 400
UNAUTHORIZED = 401
FORBIDDEN = 403
NOT_FOUND = 404
METHOD_NOT_ALLOWED = 405
NOT_ACCEPTABLE = 406
PROXY_AUTHENTICATION_REQUIRED = 407
REQUEST_TIMEOUT = 408
CONFLICT = 409
GONE = 410

INTERNAL_ERROR = 500
NOT_IMPLEMENTED = 501
BAD_GATEWAY = 502
SERVICE_UNAVAILABLE = 503
GATEWAY_TIMEOUT = 504


class Response:

    def __init__(self, message=None, errors=None, status=None):
        """Create a response object.

        Args:
            message: the message object (it could be any type of object.)
            errors: the errors to attach (it could be any type of object.)
            status (int): the status of the response. Errors should use the
                status that is the most appropriate. System failures should
                set a 500.
        """

        self.status = status or 200
        self.message = message
        self.errors = errors

        if self.errors and self.status == 200:
            self.status = 400

    def __bool__(self):
        """If the request has been successful.

        Returns:
            boolean: if the response is considered successful.
        """

        return 200 <= self.status < 300 and not self.errors


def create_fatal_response(message=None):
    """Create a fatal response.

    Args:
        message: the error to add (it could be any type of object, from string
            to dict.)

    Returns:
        Response: the fatal error response object.
    """

    return create_error_response(
        ERROR_CODE_INTERNAL_ERROR, message,
        status=INTERNAL_ERROR)


def create_error_response(code, message, status=BAD_REQUEST):
    """Create a fail response.

    Args:
        code (str): the code of the error. The title should be lowercase and
            underscore separated.
        message (dict, list, str): the message of the error.
            This can be a list, dictionary or simple string.
        status (int): the status code. Defaults to 400.

    Returns:
        Response: the response with the error. The format of the error is the
            following: code and message. The code could be `user_error` or
            `internal_error`. The message contains either a string, or a list
            or a dictionary. If not specify, the status will be a 400.
    """

    errors = dict(code=code, message=message)
    return Response(errors=errors, status=status)


def create_not_found_response(message=None):
    """Create a not found response.

    Args:
        message: The errors to add (it could be any type of object, from
            strings to dict.)

    Returns:
        Response: the “not found” response object.
    """

    return create_error_response(
        ERROR_CODE_NOT_FOUND, message, status=NOT_FOUND)
