"""Bot interfaces.
"""
from urllib.parse import urlparse

from chatterbot import ChatBot

from .. import config


def mongodb_database(url, default):
    db = urlparse(url).path or '/'
    db = db.split('/')[1]
    return db if db else default

default_bot = ChatBot(
    'Default Bot',
    read_only=True,
    trainer='chatterbot.trainers.ChatterBotCorpusTrainer',
    storage_adapter='chatterbot.storage.MongoDatabaseAdapter',
    database=mongodb_database(config.MONGODB_URL, 'chatterbot-english'),
    database_uri=config.MONGODB_URL)

default_bot.train('chatterbot.corpus.english')
