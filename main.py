"""Main
"""
import logging

from hr import config
from hr.app import app

def run_server():
    logging.info('Starting server')
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)

run_server()