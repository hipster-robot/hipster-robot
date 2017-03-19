"""Bot interfaces.
"""
from .. import config
from chatterbot import ChatBot

default_bot = ChatBot(
    'Default Bot',
    read_only=True,
    trainer='chatterbot.trainers.ChatterBotCorpusTrainer',
    storage_adapter='chatterbot.storage.MongoDatabaseAdapter',
    database='chatterbot-english',
    database_uri=config.MONGODB_URL)

default_bot.train('chatterbot.corpus.english')
