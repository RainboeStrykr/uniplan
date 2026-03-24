from fastapi import APIRouter, Depends
from typing import Dict, Any
from api.store import get_store

router = APIRouter()

@router.get("/")
def get_timetable(store: Dict[str, Any] = Depends(get_store)):
    sol = store.get("latest_solution")
    if sol:
        # Convert raw string combination to objects for frontend
        formatted_sol = []
        courses = store["courses"]
        rooms = store["rooms"]
        time_slots = store["time_slots"]
        professors = store["professors"]
        
        for session_id, assigned_val in sol.items():
            course_id = session_id.split("_")[0]
            ts_id, r_id = assigned_val.split("::")
            
            c = courses[course_id]
            formatted_sol.append({
                "session_id": session_id,
                "course": c,
                "professor": professors.get(c["professor_id"]),
                "room": rooms.get(r_id),
                "time_slot": time_slots.get(ts_id)
            })
            
        return {"timetable": formatted_sol, "raw": sol}
    return {"timetable": [], "message": "No solution available"}

@router.post("/export")
def generate_export(store: Dict[str, Any] = Depends(get_store)):
    # Return a mocked CSV string or similar
    sol = store.get("latest_solution")
    if sol:
        csv = "Course,Professor,Room,Time\n"
        for s_id, val in sol.items():
            ts_id, r_id = val.split("::")
            course_id = s_id.split("_")[0]
            csv += f"{course_id},Prof,Room_{r_id},Slot_{ts_id}\n"
        return {"file": csv, "filename": "timetable.csv"}
    return {"error": "No timetable to export"}

@router.get("/preview")
def get_preview(store: Dict[str, Any] = Depends(get_store)):
    sol = store.get("latest_solution", {})
    return {"preview": sol}
