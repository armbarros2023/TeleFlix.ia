#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting PostgreSQL Connection Test on VPS...${NC}"

# 1. Check Docker Status
echo -e "\n${GREEN}1. Checking Docker Status...${NC}"
if systemctl is-active --quiet docker; then
    echo "Docker is running."
else
    echo -e "${RED}Docker is NOT running!${NC}"
    exit 1
fi

# 2. Check Running Containers
echo -e "\n${GREEN}2. Checking Running Containers...${NC}"
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"

# 3. Find Postgres Container
CONTAINER_ID=$(docker ps -qf "name=postgres")
if [ -z "$CONTAINER_ID" ]; then
    # Try finding by image name if name doesn't match
    CONTAINER_ID=$(docker ps -qf "ancestor=postgres")
fi

if [ -n "$CONTAINER_ID" ]; then
    echo -e "${GREEN}Found PostgreSQL container: $CONTAINER_ID${NC}"
    
    # 4. Test Connection inside container
    echo -e "\n${GREEN}3. Testing Database Connection (internal)...${NC}"
    
    # We assume the default user is 'postgres' or check env vars if we could.
    # Trying a simple connection check.
    if docker exec $CONTAINER_ID psql -U postgres -c '\l' > /dev/null 2>&1; then
        echo -e "${GREEN}Successfully connected to PostgreSQL inside the container!${NC}"
    else
        echo -e "${RED}Failed to connect to PostgreSQL inside the container.${NC}"
        echo "Checking logs..."
        docker logs --tail 20 $CONTAINER_ID
    fi
    
    # 5. Check Port Mapping
    echo -e "\n${GREEN}4. Checking Port Mapping...${NC}"
    PORT_MAP=$(docker port $CONTAINER_ID 5432)
    if [ -n "$PORT_MAP" ]; then
        echo "Port 5432 is mapped to: $PORT_MAP"
    else
        echo -e "${RED}Port 5432 is NOT mapped to the host!${NC}"
    fi

else
    echo -e "${RED}No PostgreSQL container found running!${NC}"
    echo "Please check if you have started the containers with 'docker-compose up -d'"
fi
