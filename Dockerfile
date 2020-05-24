FROM python:3

ADD . /tweet-map
WORKDIR /tweet-map
RUN pip install -r requirements.txt
CMD ["python", "./web-ui/src/threadedServer.py"]
EXPOSE 8800
