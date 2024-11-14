FROM python:3.13-alpine
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
# relative to build context of docker compose
COPY . /app

WORKDIR /app
RUN apk add --no-cache --virtual .build-deps \
        musl-dev \
        linux-headers \
        gcc \
        g++ \
        make \
        curl
RUN ls -la
RUN cd ta-lib/ \
    && ./configure --prefix=/usr \
    && make \
    && make install \
    && pip3 install setuptools numpy \
    && pip3 install ta-lib==${PYTHON_TA_LIB_VERSION} \
    && apk del .build-deps \
    && rm -rf /root/.cache \
              /tmp/* \
              /var/cache/apk/* \
              /var/lib/apk/lists/*

RUN pip3 install --upgrade pip

RUN apt-get install -y --no-install-recommends make
RUN cd backend && \
    ./configure --prefix=/usr && \
    make && \
    make install

RUN pip3 install -r requirements.txt
RUN pip3 install -r sqa-requirements.txt
RUN rm -rf /tmp
# relative to workdir
ENTRYPOINT ["sh", "entrypoint.sh"]
