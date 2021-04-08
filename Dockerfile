# main image
FROM python:3.7

# working directory
WORKDIR /app

# copying data
COPY . .

# installing necessary dependencies
RUN apt-get update && apt-get install -y make nginx

# installing dependency
RUN pip install -r requirements.txt

# start nginx
RUN service nginx start

# entry point
ENTRYPOINT ["nginx", "-g", "daemon off;"]
