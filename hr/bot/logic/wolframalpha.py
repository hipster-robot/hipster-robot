"""Wolfram Alpha logic adapter for ChatterBot
"""
import logging
from xml.etree import ElementTree

import requests
from chatterbot.logic import LogicAdapter
from chatterbot.conversation import Statement

logger = logging.getLogger(__name__)

api_url = 'https://api.wolframalpha.com/v2'
validate_url = '{}/validatequery'.format(api_url)
query_url = '{}/query'.format(api_url)

def validate_query(app_id, query):
    """Returns true or false depending on whether the query is likely to be
    understood by wolfram alpha.

    """
    params = {
        'appid': app_id,
        'input': query
    }
    # This API is not JSON compatible :(
    resp = requests.get(validate_url, params=params)
    logger.debug('Response body {}'.format(resp.text))
    root = ElementTree.fromstring(resp.text)
    success = root.attrib.get('success')
    error = root.attrib.get('error')
    return success == 'true' and error == 'false'

def perform_query(app_id, query):
    """Performs the given query and return a statement that's compatible with chatterbot.

    """
    params = {
        'appid': app_id,
        'input': query,
        'output': 'json',
        'includepodid': ['Input', 'Result'],
        'format': 'plaintext'
    }
    resp = requests.get(query_url, params=params)
    data = resp.json().get('queryresult', {})
    logger.debug('Response body {}'.format(data))
    statement = Statement('')
    statement.confidence = 0
    if not data.get('success') or int(data.get('numpods')) < 2:
        return statement

    pods = data.get('pods', [])

    input_pod = next(pod for pod in pods if pod['id'] == 'Input')
    result_pod = next(pod for pod in pods if pod['id'] == 'Result')

    parsed_input = input_pod['subpods'][0]['plaintext']
    result = result_pod['subpods'][0]['plaintext']

    statement.text = '''I understood that as "{}" and this is what I know about that:
    {}'''.format(parsed_input, result)
    statement.confidence = 1
    return statement


class WolframAlpha(LogicAdapter):
    """WolframAlpha is a logic adapter for ChatterBot"""

    def __init__(self, **kwargs):
        self.app_id = kwargs.get('wolfram_alpha_app_id')
        super().__init__(**kwargs)

    def can_process(self, statement):
        logger.debug('Determining whether to process "{}"'
                     .format(statement))
        if not self.app_id:
            return False
        logger.debug('Calling query validator')

        return validate_query(self.app_id, statement.text)


    def process(self, statement):
        logger.debug('Processing statement')
        return perform_query(self.app_id, statement.text)