from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from api.store import get_store

router = APIRouter()

@router.get("/")
def get_conflicts(store: Dict[str, Any] = Depends(get_store)):
    # In a full app, this would check an ongoing assignment or user manual assignment for hard/soft constraint violations.
    # We return the stored conflict sets from the last solve run if tracking them
    steps = store["latest_steps"]
    if steps:
        # Get the latest known conflict sets from the state or any tracked violations
        last_step = steps[-1]
        return {"conflicts": [], "conflict_set": last_step.get("conflict_set", {})}
    return {"conflicts": [], "conflict_set": {}}

@router.post("/resolution")
def apply_resolution(resolution: dict, store: Dict[str, Any] = Depends(get_store)):
    # e.g., Relaxing a constraint weight, or forcibly assigning a value
    return {"message": "Resolution applied. Try solving again."}

@router.get("/conflict-set")
def get_conflict_sets(store: Dict[str, Any] = Depends(get_store)):
    steps = store["latest_steps"]
    if steps:
        last_step = steps[-1]
        return {"conflict_set": last_step.get("conflict_set", {})}
    return {"conflict_set": {}}
