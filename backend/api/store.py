from typing import Dict, Any, List
from models.responses import TimetableState, PerformanceMetrics

# In-memory store
STATE: Dict[str, Any] = {
    "courses": {
        "CS101": {"id": "CS101", "name": "Intro to Algorithms", "duration": 2, "type": "Lecture", "professor_id": "P1", "student_group_ids": ["G1"]},
        "BIO204": {"id": "BIO204", "name": "Microbiology Lab", "duration": 3, "type": "Lab", "professor_id": "P2", "student_group_ids": ["G2"]}
    },
    "professors": {
        "P1": {"id": "P1", "name": "Dr. Alan Turing", "unavailable_slots": []},
        "P2": {"id": "P2", "name": "Dr. Rosalind Franklin", "unavailable_slots": ["T1"]}
    },
    "rooms": {
        "R1": {"id": "R1", "name": "Room 402", "capacity": 150, "type": "Lecture"},
        "R2": {"id": "R2", "name": "Lab 101", "capacity": 30, "type": "Lab"}
    },
    "time_slots": {
        "T1": {"id": "T1", "day": "Monday", "start_time": "09:00", "end_time": "11:00"},
        "T2": {"id": "T2", "day": "Tuesday", "start_time": "14:00", "end_time": "17:00"}
    },
    "student_groups": {
        "G1": {"id": "G1", "name": "CS Freshmen", "size": 120, "course_ids": ["CS101"]},
        "G2": {"id": "G2", "name": "Bio Sophomores", "size": 25, "course_ids": ["BIO204"]}
    },
    "constraints": [
        {"id": "c1", "name": "Lecturer Overlap", "weight": 1, "description": "Professor cannot be in two places at once"},
        {"id": "c2", "name": "Room Overlap", "weight": 1, "description": "Room cannot host two classes at once"},
        {"id": "c3", "name": "Student Group Overlap", "weight": 1, "description": "Student group cannot attend two classes at once"},
        {"id": "c4", "name": "Room Capacity", "weight": 1, "description": "Room must be large enough"},
        {"id": "c5", "name": "Professor Availability", "weight": 1, "description": "Professor must be available"}
    ],
    "latest_solution": None,
    "latest_metrics": None,
    "latest_steps": [],
    "conflict_sets": []
}

def get_store() -> Dict[str, Any]:
    return STATE
