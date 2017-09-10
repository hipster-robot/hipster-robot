"""Configuration
"""
import os
import logging

HOST = '0.0.0.0'
PORT = os.environ.get('PORT', 4000)
DEBUG = os.environ.get('DEBUG', 'True') == 'True'
ENV = os.environ.get('ENV', 'development')
REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')
MONGODB_URL = os.environ.get('MONGODB_URL', 'mongodb://localhost:27017')
WOLFRAM_ALPHA_APP_ID = os.environ.get('WOLFRAM_ALPHA_APP_ID')

logging.basicConfig(level=logging.DEBUG if ENV == 'development'
                    else logging.INFO)
