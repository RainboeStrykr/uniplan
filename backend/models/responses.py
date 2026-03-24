from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from .resources import CourseSession

class PerformanceMetrics(BaseModel):
    nodes_expanded: int
    time_taken_ms: float
    backtrack_count: int
    heuristic_used: str

class TimetableState(BaseModel):
    step: int
    current_variable: Optional[str] = None
    assigned_value: Optional[str] = None
    action: str = "assign" # "assign", "backtrack", "forward_check"
    is_complete: bool = False
    assignment: Dict[str, str] # course_session_id -> time_slot_room_str
    conflict_set: Optional[Dict[str, List[str]]] = None # variables and their reduced domains

class FinalTimetable(BaseModel):
    assignments: Dict[str, str]
    metrics: PerformanceMetrics
