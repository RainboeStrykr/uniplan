from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import input, solve, conflicts, analytics, timetable

app = FastAPI(title="UniPlan API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(input.router, prefix="/api/resources", tags=["input_resources"])
app.include_router(input.router, prefix="/api/constraints", tags=["input_constraints"])
app.include_router(solve.router, prefix="/api", tags=["algorithm_solve"]) # /api/solve and /api/visualization
app.include_router(conflicts.router, prefix="/api/conflicts", tags=["conflict_resolution"])
app.include_router(analytics.router, prefix="/api/performance", tags=["performance"])
app.include_router(timetable.router, prefix="/api/timetable", tags=["timetable_output"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the UniPlan Backend API"}
