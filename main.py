"""Main
"""
import time
import logging

from multiprocessing import Process
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

from hr import config
from hr.app import app


class Reloader:
    """Temporary reloader solution until Sanic supports livereloading"""
    class Handler(PatternMatchingEventHandler):
        def __init__(self, reloader):
            self.reloader = reloader
            super().__init__(['*.py'])

        def on_any_event(self, event):
            self.reloader.reload()

    def __init__(self, directory, callback):
        self.observer = None
        self.process = None
        self.handler = Reloader.Handler(self)
        self.directory = directory
        self.callback = callback

    def watch(self, first=True):
        if first:
            self.reload()
        else:
            self.observer = Observer()
            self.observer.schedule(self.handler, self.directory, recursive=True)
            self.observer.start()

    def reload(self):
        if self.observer:
            self.observer.stop()
            self.process.terminate()
            self.process.join()
        try:
            self.process = Process(target=self.callback)
            self.process.start()
        finally:
            self.watch(first=False)


def run_server():
    logging.info('Starting server')
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)


if config.ENV == 'development':
    logging.debug('Running with watch')
    Reloader('hr', run_server).watch()
    while True:
        time.sleep(1)
else:
    run_server()
