# Datasets Upload Guide

## 📋 Complete Upload Process

### Step 1: Navigate to Input Management
Go to the **Input Management** page in the UniPlan application

### Step 2: Upload All 5 Required CSV Files
For each tab below, upload the corresponding CSV file:

1. **Courses Tab** → Upload `demo_courses.csv`
2. **Professors Tab** → Upload `demo_professors.csv`  
3. **Rooms Tab** → Upload `demo_rooms.csv`
4. **Time Slots Tab** → Upload `demo_time_slots.csv`
5. **Student Groups Tab** → Upload `demo_student_groups.csv`

### Step 3: Verify Upload Success
After each upload, you should see:
- ✅ Success message: "Successfully parsed and added X items"
- 📊 Data appearing in the "Active Catalog" table
- 🎯 No error messages

### Step 4: Run the Solver
1. Navigate to **Algorithm Visualisation** page
2. Click **"Start CSP Solver"**
3. Should see: "Solution found successfully!"

## 📁 CSV File Locations

All demo CSV files are located in the `backend/data/` directory:
- `demo_courses.csv` - 8 courses
- `demo_professors.csv` - 6 professors
- `demo_rooms.csv` - 6 rooms  
- `demo_time_slots.csv` - 35 time slots
- `demo_student_groups.csv` - 3 student groups

## 🚀 Quick Start

1. Start backend: `cd backend && .\venv\Scripts\activate && uvicorn main:app --reload`
2. Start frontend: `npm run dev`
3. Go to Input Management page
4. Upload all 5 CSV files in their respective tabs
5. Go to Algorithm Visualisation and run the solver