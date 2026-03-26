from fastapi import APIRouter, Depends
from typing import Dict, Any
from models.resources import Course, Professor, Room, TimeSlot, StudentGroup
from models.constraints import ConstraintWeight
from api.store import get_store

router = APIRouter()

@router.get("/constraints")
def get_constraints(store: Dict[str, Any] = Depends(get_store)):
    return {"constraints": store["constraints"]}

@router.post("/constraints")
def update_constraints(constraints: list[ConstraintWeight], store: Dict[str, Any] = Depends(get_store)):
    store["constraints"] = [c.model_dump() for c in constraints]
    return {"message": "Constraints updated"}

@router.get("/resources")
def get_resources(store: Dict[str, Any] = Depends(get_store)):
    return {
        "courses": list(store["courses"].values()),
        "professors": list(store["professors"].values()),
        "rooms": list(store["rooms"].values()),
        "time_slots": list(store["time_slots"].values()),
        "student_groups": list(store["student_groups"].values())
    }

@router.post("/resources")
def add_resource(resource_type: str, item: dict, store: Dict[str, Any] = Depends(get_store)):
    if resource_type not in store:
        return {"error": "Invalid resource type"}
    store[resource_type][item["id"]] = item
    return {"message": f"Added {resource_type}"}

import csv
from io import StringIO
from pydantic import BaseModel

class CSVUpload(BaseModel):
    resource_type: str
    csv_content: str

@router.delete("/resources")
def clear_resources(resource_type: str, store: Dict[str, Any] = Depends(get_store)):
    clearable = ["courses", "professors", "rooms", "time_slots", "student_groups"]
    if resource_type == "all":
        for key in clearable:
            store[key] = {}
        store["latest_solution"] = None
        store["latest_metrics"] = None
        store["latest_steps"] = []
        return {"message": "All resources cleared."}
    if resource_type not in clearable:
        return {"error": "Invalid resource type"}
    store[resource_type] = {}
    return {"message": f"Cleared all {resource_type}."}

@router.post("/upload")
def upload_csv(upload: CSVUpload, store: Dict[str, Any] = Depends(get_store)):
    rtype = upload.resource_type
    if rtype not in store:
        return {"error": "Invalid resource type"}
    
    try:
        reader = csv.DictReader(StringIO(upload.csv_content.strip()))
        
        # Strict Header Validation to prevent cross-uploading
        if not reader.fieldnames:
            return {"error": "Empty CSV file."}
        if rtype == "courses" and "duration" not in reader.fieldnames:
            return {"error": "Invalid CSV for Courses. Missing 'duration' column."}
        if rtype == "professors" and "unavailable_slots" not in reader.fieldnames:
            return {"error": "Invalid CSV for Professors. Missing 'unavailable_slots' column."}
        if rtype == "rooms" and "capacity" not in reader.fieldnames:
            return {"error": "Invalid CSV for Rooms. Missing 'capacity' column."}
        if rtype == "student_groups" and "size" not in reader.fieldnames:
            return {"error": "Invalid CSV for Student Groups. Missing 'size' column."}
        if rtype == "time_slots" and ("day" not in reader.fieldnames or "start_time" not in reader.fieldnames or "end_time" not in reader.fieldnames):
            return {"error": "Invalid CSV for Time Slots. Missing 'day', 'start_time', or 'end_time' columns."}

        count = 0
        for row in reader:
            if "id" not in row or not row["id"]:
                continue
                
            item = dict(row)
            
            # Type casting for specific fields
            if rtype == "courses" and "duration" in item:
                try:
                    item["duration"] = float(item["duration"])
                except ValueError:
                    item["duration"] = 1.0

            if "capacity" in item:
                try:
                    item["capacity"] = int(item["capacity"])
                except ValueError:
                    item["capacity"] = 0

            if "size" in item:
                try:
                    item["size"] = int(item["size"])
                except ValueError:
                    item["size"] = 0
                    
            if "unavailable_slots" in item:
                val = item["unavailable_slots"].strip().strip('"')
                item["unavailable_slots"] = [s.strip() for s in val.replace(";", ",").split(",") if s.strip()] if val else []
                
            if "student_group_ids" in item:
                val = item["student_group_ids"].strip().strip('"')
                item["student_group_ids"] = [s.strip() for s in val.replace(";", ",").split(",") if s.strip()] if val else []

            if "course_ids" in item:
                val = item["course_ids"].strip().strip('"')
                item["course_ids"] = [s.strip() for s in val.replace(";", ",").split(",") if s.strip()] if val else []

            store[rtype][item["id"]] = item
            count += 1
            
        return {"message": f"Successfully parsed and added {count} {rtype} items."}
    except Exception as e:
        return {"error": f"Failed to parse CSV: {str(e)}"}
