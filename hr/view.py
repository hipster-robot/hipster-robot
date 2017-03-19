"""View-related helper functions.
"""
import os

from jinja2 import Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader(
    os.path.join(os.path.dirname(os.path.abspath(__file__)),
                 'templates')))


def render(template, **kwargs):
    return env.get_template(template).render(**kwargs)
