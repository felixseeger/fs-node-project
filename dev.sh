#!/bin/bash

# Start backend in the background
echo "Starting backend on port 3001..."
cd api
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Start frontend in the background
echo "Starting frontend on port 5173..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Both services are running. Check backend.log and frontend.log for output."
echo "Press Ctrl+C to stop both services."

# Save PIDs to files
echo $BACKEND_PID > backend.pid
echo $FRONTEND_PID > frontend.pid

# Handle Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; rm backend.pid frontend.pid; echo 'Stopped.'; exit" INT

# Wait for background processes
wait
