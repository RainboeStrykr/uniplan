# UniPlan: Smart Timetable Scheduler 🎓

UniPlan is a modern, full-stack university timetable scheduling application. It uses a **Constraint Satisfaction Problem (CSP)** engine built in Python to automatically resolve complex scheduling variables—like room capacities, lecturer overlap, and student group conflicts—and pairs it with a beautiful, interactive **React** Frontend.

## ✨ Features
- **CSP Algorithm Engine**: Python backend wielding Backtracking, Forward Checking, and Advanced Heuristics (MRV, MCV, LCV).
- **Interactive Visualizer**: Watch the algorithm build the schedule in real-time.
- **Dynamic Resource Management**: Add Courses, Professors, and Rooms manually or import directly via CSV.
- **Performance Analytics**: Compare algorithmic node-expansion and execution time natively against baseline Backtracking.
- **Smart Result Generation**: Dynamic timetable mapping displaying fully optimized, clash-free schedules.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v16+ recommended)
- **Python** (v3.9+ recommended)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/RainboeStrykr/uniplan.git
cd uniplan
```

### 2. Backend Setup (FastAPI & CSP Engine)
The backend requires Python and standard API dependencies to run the timetable algorithm.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic

# Start the Python Backend Server
uvicorn main:app --reload
```
*The backend API and its swagger documentation will now be silently running at `http://127.0.0.1:8000/docs`.*

### 3. Frontend Setup (React + Vite)
In a **new terminal window**, initialize and boot the user interface!

```bash
# Ensure you are in the root `uniplan` directory
# Install Node dependencies
npm install

# Start the React Development Server
npm run dev
```

### 4. Run the App
Open your browser and navigate to the address provided by Vite (usually `http://localhost:5173`). 
You can start generating schedules by navigating to the **Input Management** hub to verify the active resources, and then heading to the **Algorithm Visualiser** to kick off the CSP solver!

---

## 📂 Project Structure

- `/src`: Contains the React SPA, routing configuration, styling elements, and core UI pages.
- `/backend`: Contains the Python FastAPI server.
  - `/backend/engine`: The isolated mathematical constraint satisfaction backtracking logic.
  - `/backend/api`: REST routes handling data ingestion, algorithm triggers, and visualization payloads.
  - `/backend/models`: Strict Pydantic typings to gracefully handle CSV imports and input data.

## 📝 Demo Data
If you'd like to test the tool using CSVs, you will find three pre-formatted CSVs (`demo_courses.csv`, `demo_professors.csv`, and `demo_rooms.csv`) natively baked into the `/backend` folder. 

1. Go to the "Input Management" tab.
2. Select the specific resource tab (e.g., Courses).
3. Drag and drop the corresponding CSV into the upload section.
4. Watch the catalog populate instantly!
