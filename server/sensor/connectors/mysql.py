"""
MySQL Connector.
"""

from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy import pool
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool

from sensor import config
from sensor.api import app

POOL_CLASS = QueuePool
POOL_MAX_OVERFLOW = -1
POOL_RECYCLE_MS = 3600
POOL_SIZE = 15


def _create_engine(db_url):
    """Create engine based on config settings."""
    if POOL_CLASS == pool.QueuePool:
        return create_engine(
            db_url, pool_size=POOL_SIZE,
            max_overflow=POOL_MAX_OVERFLOW,
            pool_recycle=POOL_RECYCLE_MS)

    return create_engine(db_url, poolclass=POOL_CLASS)


sensor_db_engine = _create_engine(config.SENSOR_DB_URL)
sensor_session_factory = sessionmaker(bind=sensor_db_engine)
sensor_db_session = scoped_session(sensor_session_factory)
sessions = (sensor_db_session, )

BaseModel = declarative_base()


@app.teardown_request
def remove_session(exception):
    """For scoped_session, explicitly close session at end of each request.

    Args:
        exception (object): When a teardown function was called because of an
            exception it will be passed an error object.
    """
    for session in sessions:
        session.remove()


@contextmanager
def purp_db_session(read_only=False):
    """
    Provide transactional scope around series of operations for ows_podcast.

    Taken from http://docs.sqlalchemy.org/en/latest/orm/session_basics.html.
    This handles rollback and closing of session, so there is no need
    to do that throughout the code.

    Usage:
        with sensor_database_session() as session:
            session.execute(query)
    """
    session = sensor_db_session()
    try:
        yield session
        if not read_only:
            session.commit()
    except Exception:
        session.rollback()
        raise
