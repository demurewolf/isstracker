FROM python:3.10
WORKDIR /code
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY ./iss/* ./iss/
EXPOSE 8000
CMD ["uvicorn", "iss.api:app", "--host", "0.0.0.0", "--port", "8000"]
