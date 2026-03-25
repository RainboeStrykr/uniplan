from typing import Dict, Any, List
from models.responses import TimetableState, PerformanceMetrics

# In-memory store
STATE: Dict[str, Any] = {
    "courses": {},
    "professors": {},
    "rooms": {},
    "time_slots": {
        "M8":  {"id": "M8",  "day": "Monday",    "start_time": "08:00", "end_time": "09:00"},
        "M9":  {"id": "M9",  "day": "Monday",    "start_time": "09:00", "end_time": "10:00"},
        "M10": {"id": "M10", "day": "Monday",    "start_time": "10:00", "end_time": "11:00"},
        "M11": {"id": "M11", "day": "Monday",    "start_time": "11:00", "end_time": "12:00"},
        "M13": {"id": "M13", "day": "Monday",    "start_time": "13:00", "end_time": "14:00"},
        "M14": {"id": "M14", "day": "Monday",    "start_time": "14:00", "end_time": "15:00"},
        "M15": {"id": "M15", "day": "Monday",    "start_time": "15:00", "end_time": "16:00"},
        "T8":  {"id": "T8",  "day": "Tuesday",   "start_time": "08:00", "end_time": "09:00"},
        "T9":  {"id": "T9",  "day": "Tuesday",   "start_time": "09:00", "end_time": "10:00"},
        "T10": {"id": "T10", "day": "Tuesday",   "start_time": "10:00", "end_time": "11:00"},
        "T11": {"id": "T11", "day": "Tuesday",   "start_time": "11:00", "end_time": "12:00"},
        "T13": {"id": "T13", "day": "Tuesday",   "start_time": "13:00", "end_time": "14:00"},
        "T14": {"id": "T14", "day": "Tuesday",   "start_time": "14:00", "end_time": "15:00"},
        "T15": {"id": "T15", "day": "Tuesday",   "start_time": "15:00", "end_time": "16:00"},
        "W8":  {"id": "W8",  "day": "Wednesday", "start_time": "08:00", "end_time": "09:00"},
        "W9":  {"id": "W9",  "day": "Wednesday", "start_time": "09:00", "end_time": "10:00"},
        "W10": {"id": "W10", "day": "Wednesday", "start_time": "10:00", "end_time": "11:00"},
        "W11": {"id": "W11", "day": "Wednesday", "start_time": "11:00", "end_time": "12:00"},
        "W13": {"id": "W13", "day": "Wednesday", "start_time": "13:00", "end_time": "14:00"},
        "W14": {"id": "W14", "day": "Wednesday", "start_time": "14:00", "end_time": "15:00"},
        "W15": {"id": "W15", "day": "Wednesday", "start_time": "15:00", "end_time": "16:00"},
        "R8":  {"id": "R8",  "day": "Thursday",  "start_time": "08:00", "end_time": "09:00"},
        "R9":  {"id": "R9",  "day": "Thursday",  "start_time": "09:00", "end_time": "10:00"},
        "R10": {"id": "R10", "day": "Thursday",  "start_time": "10:00", "end_time": "11:00"},
        "R11": {"id": "R11", "day": "Thursday",  "start_time": "11:00", "end_time": "12:00"},
        "R13": {"id": "R13", "day": "Thursday",  "start_time": "13:00", "end_time": "14:00"},
        "R14": {"id": "R14", "day": "Thursday",  "start_time": "14:00", "end_time": "15:00"},
        "R15": {"id": "R15", "day": "Thursday",  "start_time": "15:00", "end_time": "16:00"},
        "F8":  {"id": "F8",  "day": "Friday",    "start_time": "08:00", "end_time": "09:00"},
        "F9":  {"id": "F9",  "day": "Friday",    "start_time": "09:00", "end_time": "10:00"},
        "F10": {"id": "F10", "day": "Friday",    "start_time": "10:00", "end_time": "11:00"},
        "F11": {"id": "F11", "day": "Friday",    "start_time": "11:00", "end_time": "12:00"},
        "F13": {"id": "F13", "day": "Friday",    "start_time": "13:00", "end_time": "14:00"},
        "F14": {"id": "F14", "day": "Friday",    "start_time": "14:00", "end_time": "15:00"},
        "F15": {"id": "F15", "day": "Friday",    "start_time": "15:00", "end_time": "16:00"},
    },
    "student_groups": {},
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
