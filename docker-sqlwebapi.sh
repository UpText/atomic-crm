docker build --no-cache -f Dockerfile.sqlwebapi -t atomic-crm-sqlwebapi .
docker run --name atomic-crm-sqlwebapi --rm -p 8082:80 -e VITE_SQLWEBAPI_URL=http://localhost:8083/swa atomic-crm-sqlwebapi
