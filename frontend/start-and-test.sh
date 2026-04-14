#!/bin/bash
TARGET_SCRIPT=${1:-verify-chat.js}
npm run dev > dev.log 2>&1 &
DEV_PID=$!
echo "Dev server started with PID $DEV_PID"
sleep 5
node $TARGET_SCRIPT
TEST_EXIT_CODE=$?
echo "Tests completed with exit code $TEST_EXIT_CODE"
kill $DEV_PID
exit $TEST_EXIT_CODE
