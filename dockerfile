FROM python:3.11

RUN pip3 install django && pip3 install mysqlclient

WORKDIR /usr/src/app

COPY . .

RUN pip3 install -r requirements.txt && python3 server/manage.py collectstatic --no-input

WORKDIR ./server

EXPOSE 8000

CMD ["gunicorn", "-e", "DJANGO_SETTINGS_MODULE=config.settings", "config.asgi:application", "-c", "conf.d/gunicorn.conf.py", "--preload"]