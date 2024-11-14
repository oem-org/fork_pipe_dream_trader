FROM python:3.13-alpine
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
# relative to build context of docker compose
COPY . /app

WORKDIR /app
# Install TA-Lib
# Source: https://github.com/hotep-team/docker-python-ta-lib/blob/main/Dockerfile
RUN pip3 install --upgrade pip
RUN apk add --no-cache --virtual .build-deps \
        musl-dev \
        linux-headers \
        gcc \
        g++ \
        make \
        curl
RUN cd ta-lib/ \
    && ./configure --prefix=/usr \
    && make \
    && make install
RUN pip3 install setuptools numpy \
    && pip3 install ta-lib \
    && apk del .build-deps \
    && rm -rf /root/.cache \
              /tmp/* \
              /var/cache/apk/* \
              /var/lib/apk/lists/*

RUN pip3 install -r requirements.txt
RUN pip3 install -r sqa-requirements.txt
# relative to workdir
ENTRYPOINT ["sh", "entrypoint.sh"]
