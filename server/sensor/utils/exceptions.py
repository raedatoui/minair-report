"""Minair exceptions."""


class MinairError(Exception):

    def __init__(self, message, status=500):
        """Initialize exception."""
        super().__init__()
        self.message = message
        self.status = status

    @classmethod
    def bad_request(cls, message=None):
        """Return bad request error."""
        return MinairError(message, 400)


    def __str__(self):
        """Turn this exception into a string."""
        if not self.message:
            return str(self.status)
        return 'Status %d: %s' % (self.status, self.message)
