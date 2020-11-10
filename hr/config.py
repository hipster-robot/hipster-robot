"""Configuration
"""
import os
import logging

HOST = "0.0.0.0"
PORT = os.environ.get("PORT", 4000)
DEBUG = os.environ.get("DEBUG", "True") == "True"
ENV = os.environ.get("ENV", "development")
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")
WOLFRAM_ALPHA_APP_ID = os.environ.get("WOLFRAM_ALPHA_APP_ID")
SQLITE_URL = os.environ.get("SQLITE_URL", "sqlite:///db.sqlite3")

logging.basicConfig(level=logging.DEBUG if ENV == "development" else logging.INFO)

# Hack to ensure the right model is loaded.
# python -m spacy download en would be easier,
# but we don't have that on Heroku.
class CUSTOM_ENGLISH_CLASS:
    ISO_639_1 = "en_core_web_sm"
    ISO_639 = "en_core_web_sm"
    ENGLISH_NAME = "English"
