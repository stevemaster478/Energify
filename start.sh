#!/bin/sh
set -e

# Avvia il backend Express sulla porta 5000 (fissa interna al container)
cd /usr/src/app/backend
PORT=5000 node server.js &

# Torna nella cartella frontend
cd /usr/src/app/frontend

# Avvia il frontend Next.js.
# - In locale, se non c'è PORT, userà la 3000.
# - Su Koyeb, leggere PORT dall'ambiente (es. 8080) e ascolterà lì.
npm run start
