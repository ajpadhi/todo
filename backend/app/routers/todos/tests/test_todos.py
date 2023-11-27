from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
BASE_PATH = "/v1/todos"
HEADERS = {"Authorization": "Bearer TESTING"}


def test_get_todos_bad_param() -> None:
    """
    Test fetching todos with invalid params
    """
    # Invalid limit
    r = client.get(
        f"{BASE_PATH}?limit=10000",
        headers=HEADERS,
    )
    assert r.status_code == 422


def test_create_todo() -> None:
    """
    Test creating a todo
    """
    r = client.post(
        BASE_PATH,
        headers=HEADERS,
        json={"title": "tester", "description": "Tester", "completed": False},
    )
    assert r.status_code == 200


def test_update_todo() -> None:
    """
    Test updating a todo
    """
    r = client.get(
        BASE_PATH,
        headers=HEADERS,
    )
    assert r.status_code == 200
    todos = r.json()
    todo = todos[0]

    r = client.put(
        f"{BASE_PATH}/{todo['id']}", headers=HEADERS, json={"title": "updated_tester"}
    )
    assert r.status_code == 200


def test_update_unknown_todo() -> None:
    """
    Test updating an unknown todo
    """
    r = client.put(
        f"{BASE_PATH}/1234ca3f021684da955ad28f",
        headers=HEADERS,
        json={"title": "updated_tester"},
    )
    assert r.status_code == 404


def test_delete_todo() -> None:
    """
    Test deleting a todo
    """
    r = client.get(
        BASE_PATH,
        headers=HEADERS,
    )
    assert r.status_code == 200
    todos = r.json()
    todo = todos[0]

    r = client.delete(f"{BASE_PATH}/{todo['id']}", headers=HEADERS)
    assert r.status_code == 200


def test_delete_unknown_todo() -> None:
    """
    Test deleting an unknown todo
    """
    r = client.delete(f"{BASE_PATH}/1234ca3f021684da955ad28f", headers=HEADERS)
    assert r.status_code == 404
