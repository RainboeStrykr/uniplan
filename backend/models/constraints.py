from pydantic import BaseModel
from typing import List, Dict, Any

class ConstraintWeight(BaseModel):
    id: str
    name: str
    weight: int = 1
    description: str

class HardConstraintViolation(Exception):
    pass
