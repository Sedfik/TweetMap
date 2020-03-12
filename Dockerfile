FROM python:3

ADD . /tweet-map

RUN pip install pandas
WORKDIR /tweet-map
CMD ["python", "./web-ui/src/serveur.py"]
EXPOSE 8800