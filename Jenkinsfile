name: Application Workflow

on:
  push:
    branches: [ $default-branch ]

jobs:
  qa:
    runs-on: ubuntu-latest
    steps:
    - name: qa
      run: |
        cd backend
        pip install poetry
        poetry config virtualenvs.create false
        poetry install --without=prod --no-root --no-interaction --no-cache
        
        poetry run autoflake --check app
        poetry run black --check app
        poetry run isort --check app
        poetry run flake8 app
        poetry run mypy app