#!/bin/bash
cd /Users/varvaraesina/Desktop/фронтенд/frontend4kr
PORT=3000 node server.js & echo $! > .pids
PORT=3001 node server.js & echo $! >> .pids
PORT=3002 node server.js & echo $! >> .pids
echo "All servers started"
