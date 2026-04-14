#!/bin/bash
cd frontend
nohup npm run dev > frontend.log 2>&1 &
echo $! > frontend.pid
