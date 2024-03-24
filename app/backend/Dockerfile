FROM python:3.11-bookworm

WORKDIR /server

RUN apt update && \
    apt install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
COPY . .

EXPOSE 5001

CMD [ "gunicorn", "-c", "gunicorn_config.py" , "app:app"]