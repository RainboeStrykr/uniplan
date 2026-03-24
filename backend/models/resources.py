from pydantic import BaseModel, Field
from typing import List, Optional

class Course(BaseModel):
    id: str
    name: str
    duration: float = Field(..., description="Duration in hours per session")
    type: str = Field(..., description="E.g., Lecture, Lab, Seminar")
    professor_id: str
    student_group_ids: List[str]

class Professor(BaseModel):
    id: str
    name: str
    unavailable_slots: List[str] = Field(default_factory=list, description="List of time slot IDs where professor is unavailable")

class Room(BaseModel):
    id: str
    name: str
    capacity: int
    type: str = Field(..., description="E.g., Lab, Lecture Hall")

class TimeSlot(BaseModel):
    id: str
    day: str = Field(..., description="E.g., Monday, Tuesday")
    start_time: str = Field(..., description="Format HH:MM")
    end_time: str = Field(..., description="Format HH:MM")

class StudentGroup(BaseModel):
    id: str
    name: str
    size: int
    course_ids: List[str]

# A Variable in our CSP is essentially a specific Course Session that needs to be scheduled.
class CourseSession(BaseModel):
    id: str
    course_id: str
    session_index: int # e.g., if a course has 2 sessions per week
