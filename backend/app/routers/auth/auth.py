from typing import Any

import requests
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials, HTTPBearer

from app.config import settings
from app.utilities.logger import logger

from .models import AuthResponse

router = APIRouter()
basic_security = HTTPBasic()
security = HTTPBearer()


@router.get("/login", response_model=AuthResponse)
def login(
    response: Response,
    credentials: HTTPBasicCredentials = Depends(basic_security),
) -> Any:
    """
    Login to retrieve an access token
    """
    logger.debug(f"Login: {credentials.username}")
    response.headers["X-User"] = credentials.username

    r = requests.post(
        f"https://{settings.sso_fdqn}/as/token.oauth2",
        auth=(settings.sso_client_id, settings.sso_client_secret),
        params={
            "grant_type": "password",
            "scope": "openid",
            "username": credentials.username,
            "password": credentials.password,
        },
    )
    data = r.json()
    if not r.ok:
        raise HTTPException(
            status_code=r.status_code,
            detail=data.get("error_description"),
            headers={"X-User": credentials.username},
        )

    return {
        "access_token": data.get("access_token"),
        "expires_in": data.get("expires_in"),
    }
