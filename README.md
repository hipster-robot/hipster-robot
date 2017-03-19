# hipster-robot

The website for Hipster Robot, a chatrobot -- and more.

## Run

Running the website is easy with Docker:

    $ docker-compose build dev
    $ docker-compose up dev

Otherwise, install dependencies with `pip install -r requirements.txt` and run it:

    $ python main.py

## Test

There are a few, basic tests in place:

    $ python -m pytest tests
