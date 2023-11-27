FROM python:3.10-slim-bullseye

COPY ./pyproject.toml ./poetry.lock* ./gunicorn_conf.py /
COPY ./app /app

# Install Poetry and Dependencies
RUN python3 -m pip install poetry
RUN poetry config virtualenvs.create false

# Manually pip install appdynamics
RUN pip install appdynamics 

# Install dependencies
RUN poetry install --without dev

ENV PORT 8000
EXPOSE 8000

RUN mkdir -p /tmp/shm
RUN mkdir /.local
RUN chown -R 1001:0 /.local /app /tmp/shm
RUN chmod -R 777 /tmp /app

USER 1001

ENTRYPOINT ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "app.main:app"]
