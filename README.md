# todo

todo

## Backend

### Local MongoDB

This project includes a [docker-compose.yml](./docker-compose.yml) file for testing the full app setup with local containers. The frontend and backend code are developed on the local host but the local mongoDB can be ran and connected to.

```bash
$ docker-compose up mongodb -d

[+] Running 1/1
 ⠿ Container ab-mongo  Started    0.4s
```

Once the local MongoDB container is running, the local `.env` file in the backend folder can be updated to use the local dev DB.

```bash
MONGO_URI=mongodb://root:Cisc0123@localhost:27017/
```

### Development Setup

These APIs are written using Python 3.10 and the [FastAPI](https://fastapi.tiangolo.com/) framework and dependencies are managed with [Poetry](https://python-poetry.org/docs/master/).  
The `cmd.sh` helper script is written for usage with a unix based bash shell which is the default on Mac and Linux but within Windows you will need to utilize a linux kernel.

#### Windows or non M1 Mac

A `Vagrantfile` is included with this project so after installing [Virtual Box](https://www.virtualbox.org/wiki/Downloads) and [Vagrant](https://developer.hashicorp.com/vagrant/downloads) the following commands can be ran to boostrap the development environment, map the project to the `/vagrant` path in the VM and expose the ports.

> Powershell

```powershell
$ vagrant up
$ vagrant ssh
$ cd /vagrant
```

#### M1 mac or Manual setup

**In the `backend` folder**

Verify you have python 3.10 installed.

```bash
$ python3 --version

Python 3.10.8
```

Then you need to install poetry which will manage dependencies and the python virtual environment.

```bash
$ curl -sSL https://install.python-poetry.org | python3 -
```

Install the required development and production project dependencies.

```bash
$ poetry install
```

You will need to have the production `.env` file in the backend folder in order to authenticate, connect to DBs, etc. and the required keys can be checked in the `.env-example` file.

Start the development server which will reload as changes are made and access the OpenAPI frontend at <http://localhost:8000>

```bash
$ ./cmd.sh start

Dev API Docs: http://localhost:8000
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
[17/Mar/2022 14:42:28] INFO [uvicorn.error.bind_socket:564] Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [35680] using watchgod
[17/Mar/2022 14:42:28] INFO [uvicorn.error.startup:59] Application startup complete.
```

### Code Quality

Code consistency, quality and formatting is maintained with the following tools.

- [black](https://black.readthedocs.io/en/stable/)
- [flake8](https://flake8.pycqa.org/en/latest/)
- [isort](https://pycqa.github.io/isort/)
- [mypy](https://mypy.readthedocs.io/en/stable/)

The `./cmd.sh format` command can be ran to format the project files which runs the tools with the following options. Most IDEs allow a `format on save` feature which is convient to setup with these configurations as well.

### Best Practices

- Include type hints for the parameters on functions
- Include docstrings on functions
- Minimize the number of funcitons in a single file instead opt for addional files with relevant names.
- Add pydantic models and enums within their own file for each API router

## Frontend

### Development setup

This project requires `NodeJS 18.X` and `Yarn`.

### Styles

CSS Styling is done with the Cisco UI Kit and [Vitaly Kumov's](https://directory.cisco.com/dir/reports/vkumov) Cisco UI React Library.

Cisco UI Kit

- Docs: <http://cisco-ui.cisco.com>

React Cisco UI Kit Library

- Docs: <https://vkumov.github.io/react-cui-2.0/?path=/story/introduction--page>
- Source Code: <https://github.com/vkumov/react-cui-2.0>

### Browser

For local development you will want to use Chrome and run it with security/CORS disabled.

Mac OS:
> open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

Windows:
> "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp

source: <https://alfilatov.com/posts/run-chrome-without-cors/>

### Running

**In the `frontend` folder**

### `yarn install`

Installs dependencies

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

This web app setup was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Deployment

This project includes a [.gitlab-ci.yml](./.gitlab-ci.yml) configuration to build and deploy new containers to the CAE Openshift Kubernetes cluster with the following process.

- Update the Backend API version in [pyproject.toml](./backend/pyproject.toml)
- Update the Frontend version in [package.json](./frontend/package.json)
- Update the API container image to the new version in [values.yaml](./infra/values.yaml)
- Update the Helm chart image in [Chart.yaml](./infra/chart.yaml)
- Update the [CHANGELOG.md](./CHANGELOG.md) with brief descriptions of the version changes
- Add, Commit and Push the changes to the `master` branch which triggers the stage deployment

```bash
$ git add .
$ git commit -m "1.0.2 Changes"
$ git push 
```

- Create and Push the new API version tag which triggers the prod deploymnent

```bash
$ git tag 1.0.2 && git push origin -u 1.0.2
```

This will create a new container for the backend API code with the version set to the tag and update the API Kubernetes deployment to use the new container with helm. The frontend code will be built and copied to the persistent disk of the running NGINX server.
