from datetime import datetime
from typing import Any

from bson.objectid import ObjectId
from fastapi import APIRouter, HTTPException, Path, Query, Request, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.static_values import mongo_id_regex
from app.utilities.db import db
from app.utilities.logger import logger

from .enums import Status
from .models import ResponseStatus, Todo, TodoRecord, TodoUpdate

router = APIRouter()
security = HTTPBearer()


@router.get("", response_model=list[TodoRecord])
async def get_todos(
    request: Request,
    limit: int = Query(500, le=2000, description="Maximum number of todos to return"),
    skip: int = Query(0, description="Number of todos to skip"),
    access_token: HTTPAuthorizationCredentials = Security(security),
) -> Any:
    """
    Get todos
    """
    username = request.headers.get("x-user")

    user_todos = []
    for item in db.todos.find({"owner": username}, limit=limit, skip=skip):
        item["id"] = str(item["_id"])
        del item["_id"]
        user_todos.append(item)

    return user_todos


@router.post("", response_model=ResponseStatus)
async def create_todo(
    payload: Todo,
    request: Request,
    access_token: HTTPAuthorizationCredentials = Security(security),
) -> Any:
    """
    Create a new todo
    """
    username = request.headers.get("x-user")
    data = payload.dict()

    now = datetime.utcnow()
    record = {
        "owner": username,
        "created_date": now,
        "updated_date": now,
        "created_by": username,
        **data,
    }

    r = db.todos.insert_one(record)
    logger.info(f"Created New Todo: {r.inserted_id}")

    return {"status": Status.created}


@router.put("/{id}", response_model=ResponseStatus)
async def update_todo(
    payload: TodoUpdate,
    request: Request,
    id: str = Path(description="Todo ID", pattern=mongo_id_regex),
    access_token: HTTPAuthorizationCredentials = Security(security),
) -> Any:
    """
    Update a todo
    """
    username = request.headers.get("x-user")
    event_id = ObjectId(id)
    data = payload.dict(exclude_unset=True)

    update_data = {
        **data,
        "updated_date": datetime.utcnow(),
    }

    r = db.todos.update_one(
        {"_id": event_id},
        {"$set": update_data},
    )
    logger.info(f"Updated Event: {r.matched_count}/{r.modified_count}")

    if r.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Todo not found",
            headers={"X-User": username},
        )

    return {"status": Status.edited}


@router.delete("/{id}", response_model=ResponseStatus)
async def delete_todo(
    request: Request,
    id: str = Path(description="Todo ID", pattern=mongo_id_regex),
    access_token: HTTPAuthorizationCredentials = Security(security),
) -> Any:
    """
    Delete a todo
    """
    username = request.headers.get("x-user")
    event_id = ObjectId(id)

    r = db.todos.delete_one({"_id": event_id, "owner": username})
    if r.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Todo not found",
            headers={"X-User": username},
        )
    logger.info(f"Deleting Event {id}: {r}")

    return {"status": Status.deleted}
