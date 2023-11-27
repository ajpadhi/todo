import pathlib

import toml
from pydantic import BaseSettings

path = pathlib.Path(__file__).parent.absolute()
with open(f"{path}/../pyproject.toml") as f:
    project_data = toml.load(f)

app_version = project_data["tool"]["poetry"]["version"]
app_name = project_data["tool"]["poetry"]["name"]
app_title = project_data["tool"]["metadata"]["title"]
app_description = project_data["tool"]["metadata"]["full_description"]


class Settings(BaseSettings):
    mongo_uri: str
    sso_client_id: str
    sso_client_secret: str
    environment: str = "prod"
    sso_fdqn: str = "cloudsso.cisco.com"
    logging_level: str = "INFO"
    root_path: str = ""
    ci: bool = False
    local_user: str = "tester"
    mongo_db: str = app_name

    class Config:
        env_file = ".env"


settings = Settings()
