#!/usr/bin/env bash

nodemon /usr/src/draw-code/packages/express_backend_app/app.js &

cd /usr/src/draw-code/packages/react_frontend_app/
npm run dev &

wait -n
