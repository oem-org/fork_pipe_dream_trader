FROM python:3.13-slim-bullseye
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
COPY ./requirements.txt /tmp/requirements.txt
COPY ./sqa-requirements.txt /tmp/sqa-requirements.txt
COPY . /app

WORKDIR /app

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

RUN pip3 install -r /tmp/requirements.txt
RUN rm -rf /tmp

ENTRYPOINT ["sh", "entrypoint.sh"]
