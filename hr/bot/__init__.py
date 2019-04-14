"""Bot interfaces.
"""
from urllib.parse import urlparse
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

from .. import config


def mongodb_database(url, default):
    db = urlparse(url).path or "/"
    db = db.split("/")[1]
    return db if db else default


default_bot = ChatBot(
    "Default Bot",
    read_only=True,
    logic_adapters=[
        {"import_path": "chatterbot.logic.MathematicalEvaluation"},
        {"import_path": "chatterbot.logic.BestMatch"},
        {"import_path": "hr.bot.logic.WolframAlpha"},
    ],
    storage_adapter="chatterbot.storage.MongoDatabaseAdapter",
    database=mongodb_database(config.MONGODB_URL, "chatterbot-english"),
    database_uri=config.MONGODB_URL,
    wolfram_alpha_app_id=config.WOLFRAM_ALPHA_APP_ID,
)

trainer = ChatterBotCorpusTrainer(default_bot)
trainer.train("chatterbot.corpus.english")
