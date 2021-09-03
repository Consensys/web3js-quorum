#!/bin/bash -u

NO_LOCK_REQUIRED=false

. ./.env

docker-compose down -v
docker-compose rm -sfv

rm ${LOCK_FILE}
echo "Lock file ${LOCK_FILE} removed"
