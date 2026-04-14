#!/bin/bash
npm run dev > dev.log 2>&1 &
DEV_PID=$!
echo "Dev server started with PID $DEV_PID"
sleep 5
npx playwright test tests/e2e/nodes.spec.js
TEST_EXIT_CODE=$?
echo "Tests completed with exit code $TEST_EXIT_CODE"
kill $DEV_PID
exit $TEST_EXIT_CODE
