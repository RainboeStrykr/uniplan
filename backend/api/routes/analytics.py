from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from api.store import get_store

router = APIRouter()

@router.get("/metrics")
def get_metrics(store: Dict[str, Any] = Depends(get_store)):
    metrics = store.get("latest_metrics")
    if metrics:
        return metrics
    return {"message": "No metrics available. Please run solve."}

@router.get("/comparison")
def get_comparison(store: Dict[str, Any] = Depends(get_store)):
    # Mocking previous runs or different heuristics for comparison
    m = store.get("latest_metrics", {})
    return {
        "current": m,
        "alternatives": [
            {
                "heuristic_used": "mrv",
                "nodes_expanded": m.get("nodes_expanded", 0) * 1.5 if m else 0,
                "time_taken_ms": m.get("time_taken_ms", 0) * 1.2 if m else 0,
                "backtrack_count": m.get("backtrack_count", 0) * 2 if m else 0,
            },
            {
                "heuristic_used": "none",
                "nodes_expanded": m.get("nodes_expanded", 0) * 5 if m else 0,
                "time_taken_ms": m.get("time_taken_ms", 0) * 4 if m else 0,
                "backtrack_count": m.get("backtrack_count", 0) * 10 if m else 0,
            }
        ]
    }
