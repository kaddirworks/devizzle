#!/usr/bin/bash

source venv/bin/activate
uvicorn devizzle.main:devizzle \
  --workers 4 \
  --host 0.0.0.0 \
  --port 8080 \
  --uds /tmp/uvicorn.sock \
  --ssl-keyfile /etc/letsencrypt/live/api.devizzle.com.br/privkey.pem \
  --ssl-certfile /etc/letsencrypt/live/api.devizzle.com.br/fullchain.pem