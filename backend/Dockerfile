FROM python:3.10
WORKDIR /code
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY ./iss ./iss
COPY ./main.py ./
COPY ./get-tle /usr/local/bin
RUN chmod +x /usr/local/bin/get-tle
EXPOSE 8000
CMD ["python", "main.py"]
