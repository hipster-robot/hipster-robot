FROM python:3.6

# Prepare app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt

# Install Vim
RUN apt-get update && apt-get install -y vim

# Install node.js
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get install -y build-essential nodejs
