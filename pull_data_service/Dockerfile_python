FROM python:3.9-alpine

#Dont buffer standart streams but send them to the terminal
ENV PYTHONBUFFERED 1
RUN mkdir -p /opt/services/timescale_pull

COPY requirements.txt /opt/services/timescale_pull
WORKDIR /opt/services/timescale_pull

RUN pip install --upgrade pip && pip install -r ./requirements.txt

#copies entire content of current directory
COPY . /opt/services/timescale_pull/



COPY ./entrypoint.sh /
ENTRYPOINT ["sh", "/entrypoint.sh"]
