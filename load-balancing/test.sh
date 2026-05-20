#!/bin/bash

echo "=== Testing Nginx (port 80) ==="
for i in {1..10}; do
    echo "Request $i:"
    curl -s http://localhost/ 2>/dev/null | grep -E '"port"|"message"' || echo "No response"
    echo "---"
done

echo ""
echo "=== Testing HAProxy (port 8080) ==="
for i in {1..10}; do
    echo "Request $i:"
    curl -s http://localhost:8080/ 2>/dev/null | grep -E '"port"|"message"' || echo "No response"
    echo "---"
done
