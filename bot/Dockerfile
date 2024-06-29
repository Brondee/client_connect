FROM python:3.10

WORKDIR /brondee/app/

COPY . .

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

RUN pip install --index-url https://codeberg.org/api/packages/Bavarder/pypi/simple/ baichat-py