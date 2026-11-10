
#!/bin/bash

echo "================================"
echo " Stopping Application"
echo "================================"

_PID=$(ss -lntp | grep ':5000 ' | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)

if [ -n "$_PID" ]; then
    kill -9 "$_PID"
    echo "stopped (PID: $_PID)"
fi

_PID=$(ss -lntp | grep ':4200 ' | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)

if [ -n "$_PID" ]; then
    kill -9 "$_PID"
    echo "stopped (PID: $FRONTEND_PID)"
fi

echo "================================"
echo " Completed"
echo "================================"

