FROM python:3
# Sets the working directory in the container  
WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .
EXPOSE 4663

CMD [ "python" , "-m", "flask", "run", "--host=0.0.0", "--port=4663"]