
#!/bin/bash

CONTAINER="sql1"

# Check container exists
if ! docker container inspect "$CONTAINER" >/dev/null 2>&1; then
    echo "[ERROR] Container '$CONTAINER' not found!"
    exit 1
fi

# Check container status
STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER")

if [ "$STATUS" = "running" ]; then
    echo "[OK] SQL Server is running."
else
    echo "[INFO] SQL Server is not running (Status: $STATUS)"
    echo "[INFO] Starting SQL Server..."

    if docker start "$CONTAINER"; then
        echo "[OK] SQL Server started successfully."
    else
        echo "[ERROR] Failed to start SQL Server."
        exit 1
    fi
fi
