# UniPlan: Smart Timetable Scheduler 🎓

UniPlan is a modern, full-stack university timetable scheduling application. It uses a **Constraint Satisfaction Problem (CSP)** engine built in Python to automatically resolve complex scheduling variables—like room capacities, lecturer overlap, and student group conflicts—and pairs it with a beautiful, interactive **React** Frontend with advanced 2D/3D visualizations.

[Academic Poster](research_poster.pdf)

## ✨ Features
- **CSP Algorithm Engine**: Python backend wielding Backtracking, Forward Checking, and Advanced Heuristics (MRV, MCV, LCV).
- **Interactive 2D/3D Visualizer**: Watch the algorithm build the schedule in real-time with interactive 3D node graphs and search trees.
- **Dynamic Resource Management**: Add Courses, Professors, and Rooms manually or import directly via CSV.
- **Performance Analytics**: Compare algorithmic node-expansion and execution time natively against baseline Backtracking.
- **Smart Result Generation**: Dynamic timetable mapping displaying fully optimized, clash-free schedules.
- **Comprehensive Documentation**: Built-in documentation explaining the entire system architecture and usage.

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
  - `/src/components`: Reusable React components including the 3D visualization system
  - `/src/pages`: Main application pages (Inputs, Visualiser, Results, Analytics, Documentation)
- `/backend`: Contains the Python FastAPI server.
  - `/backend/engine`: The isolated mathematical constraint satisfaction backtracking logic.
  - `/backend/api`: REST routes handling data ingestion, algorithm triggers, and visualization payloads.
  - `/backend/models`: Strict Pydantic typings to gracefully handle CSV imports and input data.

---

## 🧠 CSP Solver Algorithm

### Core Concepts
UniPlan uses a Constraint Satisfaction Problem approach to solve timetable scheduling:

- **Variables**: Course sessions that need to be scheduled
- **Domains**: Available timeslots and rooms for each session
- **Constraints**: Rules that prevent conflicts (professor, room, student group)

### Advanced Heuristics
The solver implements three key heuristics for optimal performance:

1. **MRV (Minimum Remaining Values)**: Select variables with smallest domains first
2. **MCV (Most Constraining Variable)**: Select variables that constrain most others
3. **LCV (Least Constraining Value)**: Try values that eliminate fewest options

### Algorithm Flow
1. Select unassigned variable using heuristics
2. Try domain values in optimal order
3. Check constraint consistency
4. Apply forward checking to prune domains
5. Recurse or backtrack if needed

---

## 🎨 3D Visualization Features

UniPlan features an advanced 3D visualization system for understanding the CSP solving process:

### Interactive 3D Components
- **Variable Nodes**: 3D spheres with color coding (blue=unassigned, green=assigned, red=conflict)
- **Constraint Edges**: Dynamic lines showing relationships between variables
- **Domain Visualization**: 3D bar charts for domain values
- **Search Tree**: 3D tree structure showing backtracking path

### Controls
- **Toggle between 2D/3D views** with a single button
- **Interactive controls**: Rotate, pan, zoom with mouse
- **Click on nodes** to see detailed domain information
- **Real-time animations** during solver execution

---

## User Guide

### Getting Started
1. **Navigate to Input Management**: Add courses, professors, rooms, and timeslots

> Refer to [DATSETS_UPLOAD_GUIDE](DATASETS_UPLOAD_GUIDE.md) for demo datasets

2. **Create Course Sessions**: Define individual class sessions with requirements
3. **Run Solver**: Start the CSP algorithm to generate timetable
4. **View Results**: Check generated timetable and resolve any conflicts

### Advanced Features
- **3D Visualization**: Switch to 3D mode for interactive constraint graph exploration
- **Performance Analysis**: Monitor solver efficiency and compare heuristics
- **Conflict Resolution**: Manually adjust constraints when automatic solving fails
- **Export Options**: Save timetables in various formats (CSV, PDF, etc.)

---

## 🔧 API Reference

The backend exposes a REST API at `http://127.0.0.1:8000`

### Key Endpoints
- `POST /api/solve` - Start CSP solver with specified heuristics
- `GET /api/visualization/state` - Get current solver state and step history
- `GET /api/performance/metrics` - Retrieve solver performance metrics
- `GET /api/timetable` - Get generated timetable results

---

## 🐛 Troubleshooting

### Common Issues
- **Solver Not Finding Solution**: Check for over-constrained schedules or insufficient resources
- **Slow Performance**: Try different heuristics or reduce problem complexity

### Solutions
- Add more timeslots or rooms
- Relax some constraints if possible
- Use different heuristic combinations
- Check for data inconsistencies
- Monitor performance metrics for bottlenecks

---

## 📚 Documentation

For detailed information about the system architecture, algorithm implementation, and advanced usage, visit the built-in **Documentation** page in the application or check the `/src/pages/Documentation.jsx` file.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.