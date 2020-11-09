"""Bot interfaces.
"""
from urllib.parse import urlparse
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

from .. import config


default_bot = ChatBot(
    "Default Bot",
    read_only=True,
    logic_adapters=[
        {"import_path": "chatterbot.logic.MathematicalEvaluation"},
        {"import_path": "chatterbot.logic.BestMatch"},
        {"import_path": "hr.bot.logic.WolframAlpha"},
    ],
    storage_adapter="chatterbot.storage.SQLStorageAdapter",
    database_uri=config.SQLITE_URL,
    wolfram_alpha_app_id=config.WOLFRAM_ALPHA_APP_ID,
)

trainer = ChatterBotCorpusTrainer(default_bot)
trainer.train("chatterbot.corpus.english")
