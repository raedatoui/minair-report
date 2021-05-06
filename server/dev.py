"""Development server.

This server is intended for development only: it enables debugging tools,
and use a different port (5000) so it can more easily interface with other
applications.

Launching the server is relatively easy::

    $ pyvenv env
    $ source env/bin/activate
    $ pip install -r requirements.txt
    $ pip install -r requirements-dev.txt
    $ python dev.py
"""

import os

from main import app


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', debug=True, port=port)
