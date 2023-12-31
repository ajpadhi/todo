import inspect
from typing import Any, Callable, TypeVar

from pydantic import BaseModel

F = TypeVar("F", bound=Callable[..., Any])


def optional(*fields: Any) -> Any:
    """
    Decorator function used to modify a pydantic model's
    fields to all be optional. Alternatively, you can also pass the field
    names that should be made optional as arguments to the decorator.
    Taken from
    https://github.com/samuelcolvin/pydantic/issues/1223#issuecomment-775363074
    """

    def dec(_cls: Any) -> Any:
        for field in fields:
            _cls.__fields__[field].required = False
        return _cls

    if fields and inspect.isclass(fields[0]) and issubclass(fields[0], BaseModel):
        cls: Any = fields[0]
        fields = cls.__fields__
        return dec(cls)

    return dec


def remove_fields(*fields: Any) -> Any:
    """
    Decorator function used to modify a pydantic model's
    fields remove a field inherited from a parent.
    """

    def dec(_cls: Any) -> Any:
        for field in fields:
            if field in _cls.__fields__:
                del _cls.__fields__[field]
        return _cls

    return dec
