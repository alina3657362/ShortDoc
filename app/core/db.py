import os
from contextlib import contextmanager

import psycopg2
from psycopg2.extras import RealDictCursor


@contextmanager
def get_db_connection():
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise RuntimeError("DATABASE_URL is not set")

    connection = psycopg2.connect(database_url, cursor_factory=RealDictCursor)

    try:
        yield connection
    finally:
        connection.close()