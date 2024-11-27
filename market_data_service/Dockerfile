FROM python:3.9-alpine

ENV PYTHONBUFFERED 1

RUN mkdir -p /opt/market_data_service

RUN apk add --no-cache postgresql-client


COPY requirements.txt /opt/market_data_service/

WORKDIR /opt/market_data_service

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /opt/market_data_service/

COPY ./entrypoint.sh /

ENTRYPOINT ["sh", "/entrypoint.sh"]
