"""Redis helpers
"""
from urllib.parse import urlparse

import asyncio_redis

from . import config


def parse_url():
    url = urlparse(config.REDIS_URL)
    return url.hostname, url.port, url.password


class Redis:
    """
    A simple wrapper class that allows you to share a connection
    pool across your application.
    """

    _pool = None

    async def get_redis_pool(self):
        if not self._pool:
            host, port, password = parse_url()
            self._pool = await asyncio_redis.Pool.create(
                host=host, port=port, password=password, poolsize=10
            )

        return self._pool


redis = Redis()
