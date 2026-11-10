
#!/bin/bash

cd ..
mkdir -p log

_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$_DIR/log"


start_service() 
{
    name=$1
    dir=$2
    cmd=$3

    if ss -lnt | grep -q ':5000 '; then
        echo "Backend already running on port 5000"
        return
    fi

    echo "Starting $name..."

    nohup bash -c "cd '$dir' && exec $cmd" > "$LOG_FILE/${name}.log" 2>&1 &
    sleep 2
}

echo "================================"
echo " Starting Application"
echo "================================"

start_service "backend" "$_DIR/backend" "dotnet run"
start_service "frontend" "$_DIR/frontend" "npm start"

echo "================================"
echo " Completed"
echo "================================"

