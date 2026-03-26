from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from api.store import get_store
from engine.csp import CSPEngine
from engine.solver import TimetableSolver
from engine.constraints import HARD_CONSTRAINTS
from models.resources import CourseSession, Course, Professor, Room, TimeSlot, StudentGroup
import traceback

router = APIRouter()

@router.post("/solve")
def solve_timetable(heuristics: List[str] = ["mrv", "mcv", "lcv"], store: Dict[str, Any] = Depends(get_store)):
    try:
        courses = store["courses"]
        professors = store["professors"]
        rooms = store["rooms"]
        time_slots = store["time_slots"]
        student_groups = store["student_groups"]
        
        # Validate that we have all required resources
        if not courses:
            return {"error": "No courses found. Please upload course data first."}
        if not professors:
            return {"error": "No professors found. Please upload professor data first."}
        if not rooms:
            return {"error": "No rooms found. Please upload room data first."}
        if not time_slots:
            return {"error": "No time slots found. Please upload time slot data first."}
        if not student_groups:
            return {"error": "No student groups found. Please upload student group data first."}
        
        # Validate that courses reference existing professors and student groups
        for course_id, course_data in courses.items():
            if course_data.get("professor_id") not in professors:
                return {"error": f"Course {course_id} references non-existent professor {course_data.get('professor_id')}"}
            
            for group_id in course_data.get("student_group_ids", []):
                if group_id not in student_groups:
                    return {"error": f"Course {course_id} references non-existent student group {group_id}"}
        
        sessions = {}
        for c_id, course_data in courses.items():
            s_id = f"{c_id}_s1"
            cs = CourseSession(id=s_id, course_id=c_id, session_index=1)
            sessions[s_id] = cs
            
        domains = {}
        domain_values = [f"{ts_id}::{r_id}" for ts_id in time_slots.keys() for r_id in rooms.keys()]
        for s_id in sessions.keys():
            domains[s_id] = list(domain_values)
            
        csp = CSPEngine(list(sessions.values()), domains)
        for hc in HARD_CONSTRAINTS:
            csp.add_constraint(hc)
            
        context = {
            "sessions": sessions,
            "courses": {k: Course(**v) for k, v in courses.items()},
            "professors": {k: Professor(**v) for k, v in professors.items()},
            "rooms": {k: Room(**v) for k, v in rooms.items()},
            "student_groups": {k: StudentGroup(**v) for k, v in student_groups.items()},
            "time_slots": {k: TimeSlot(**v) for k, v in time_slots.items()},
        }
        
        solver = TimetableSolver(csp, context)
        solution, metrics, steps = solver.solve(heuristics)
        
        store["latest_solution"] = solution
        store["latest_metrics"] = metrics.model_dump()
        store["latest_steps"] = [s.model_dump() for s in steps]
        
        return {
            "status": "success" if solution else "failed",
            "nodes_expanded": metrics.nodes_expanded,
            "time_taken_ms": metrics.time_taken_ms,
            "message": "Solution found successfully!" if solution else "No solution found - try adding more resources or relaxing constraints"
        }
    except Exception as e:
        return {"error": str(e), "traceback": traceback.format_exc()}

@router.get("/visualization/state")
def get_visualization_state(store: Dict[str, Any] = Depends(get_store)):
    return {"steps": store["latest_steps"]}

@router.get("/visualization/step")
def get_visualization_step(step_index: int, store: Dict[str, Any] = Depends(get_store)):
    steps = store["latest_steps"]
    if 0 <= step_index < len(steps):
        return steps[step_index]
    return {"error": "Step not found"}

@router.get("/performance/metrics")
def get_performance_metrics(store: Dict[str, Any] = Depends(get_store)):
    return store["latest_metrics"] or {
        "nodes_expanded": 0,
        "backtrack_count": 0,
        "time_taken_ms": 0,
        "heuristic_used": "none"
    }
