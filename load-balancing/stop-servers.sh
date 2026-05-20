#!/bin/bash
cd /Users/varvaraesina/Desktop/фронтенд/frontend4kr
if [ -f .pids ]; then
    while read pid; do
        kill $pid 2>/dev/null
        echo "Killed process $pid"
    done < .pids
    rm .pids
fi
echo "All servers stopped"
