"""Hipster Robot App

"""
import os

from sanic import Sanic, response
from sanic_session import RedisSessionInterface, InMemorySessionInterface

from . import view, config
from .bot import default_bot
from .redis import redis

app = Sanic(__name__)
here = os.path.dirname(os.path.abspath(__file__))
app.static('/js', os.path.join(here, 'static/compiled/js'))
app.static('/css', os.path.join(here, 'static/compiled/css'))
app.static('/components', os.path.join(here, 'static/components'))
app.static('/img', os.path.join(here, 'static/img'))
app.static('/favicon.ico', os.path.join(here, 'static/img/favicon.ico'))

if config.ENV == 'test':
    session_interface = InMemorySessionInterface()
else:
    session_interface = RedisSessionInterface(redis.get_redis_pool, expiry=3600)


@app.middleware('request')
async def add_session_to_request(request):
    # before each request initialize a session
    # using the client's request
    await session_interface.open(request)


@app.middleware('response')
async def save_session(request, response):
    # after each request save the session,
    # pass the response to set client cookies
    await session_interface.save(request, response)


@app.route('/')
async def index(request):
    return response.html(view.render('index.html'))


@app.route('/bot', methods=['POST'])
async def bot(request):
    body = request.json
    if not body or 'text' not in body:
        return response.json(
            {'error': '"text" is a required field'},
            status=400)
    bot_response = default_bot.get_response(body['text'])
    return response.json({'text': bot_response.text})
