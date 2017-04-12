"""App testing.
"""
import json

from hr.app import app


def test_index():
    req, res = app.test_client.get('/')
    assert res.status == 200
    assert 'Hipster' in res.text


def test_bot_405():
    req, res = app.test_client.get('/bot')
    assert res.status == 405


def test_bot_400_no_data():
    """Requires data."""
    req, res = app.test_client.post('/bot')
    assert res.status == 400


def test_bot_400_empty_body():
    """Requires a message."""
    req, res = app.test_client.post('/bot', data=json.dumps({}))
    body = json.loads(res.text)
    assert res.status == 400
    assert body['error'] == '"text" is a required field'


def test_bot():
    data = {'text': 'hello'}
    req, res = app.test_client.post('/bot', data=json.dumps(data))
    body = json.loads(res.text)
    assert body['text'] == 'Hi'
