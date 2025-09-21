# Project: Speed Test Platform

This document outlines the development plan and tasks for creating a public-facing internet speed test platform.

## Key Features

- **Modern, Dark-Themed UI:** A web interface inspired by Ookla, built with React and Tailwind CSS.
- **Real-Time Gauges and Charts:** Live visualization of download/upload speeds and connection stability.
- **Connection Stability Test:** A core feature allowing users to run tests over a chosen duration to measure connection reliability.
- **No User Accounts:** Focus on providing a great anonymous user experience.
- **Export Results:** Allow users to download their test results as a PDF or DOCX file.

## Development Plan

### 1. Backend API (Python/Flask)
- [ ] **Initialize Flask Server:** Set up a basic Flask application to serve the API.
- [ ] **Create Speed Test API Endpoint:**
    - Create a route (e.g., `/api/speedtest`) that starts the test.
    - Use WebSockets (Flask-SocketIO) to stream real-time data to the frontend.
- [ ] **Refactor `speed.py`:** Adapt the existing script to be used as a module within the Flask app.
- [ ] **Implement Jitter Calculation:** Add jitter measurement to the test results.
- [ ] **Implement PDF/DOCX Export:**
    - Create a new endpoint (e.g., `/api/export`) that takes test data and generates a file.
    - Use libraries like `ReportLab` (for PDF) and `python-docx` (for DOCX).

### 2. Frontend (React)
- [ ] **Component Structure:**
    - `SpeedTest.js`: Main component to manage state.
    - `Gauge.js`: Reusable component for download/upload gauges.
    - `StabilityChart.js`: A line chart to show speed over time.
    - `Results.js`: Component to display final metrics.
- [ ] **UI Implementation:**
    - Design the main view with a "Go" button.
    - Implement the dark theme using Tailwind CSS.
    - Connect to the backend WebSocket to receive live data.
    - Animate gauges and update the chart in real-time.
- [ ] **State Management:** Use React hooks (`useState`, `useEffect`) to manage the test state (e.g., `idle`, `testing`, `finished`).
- [ ] **Display Final Results:** Show a summary of the test with options to export.

### 3. Project Structure
- [ ] Organize files into `frontend` and `backend` directories to keep the concerns separate.
- [ ] Create a `requirements.txt` for the Python backend.
- [ ] Update `package.json` for any new frontend dependencies.
