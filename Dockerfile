# Immagine base leggera con Node LTS
FROM node:20-alpine AS base

# Directory di lavoro dentro il container
WORKDIR /usr/src/app

# Copia solo i package.json prima per sfruttare la cache
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

# Installa le dipendenze backend (solo produzione)
RUN cd backend && npm install --only=production

# Installa le dipendenze frontend (solo produzione)
RUN cd frontend && npm install --only=production

# Copia il resto del codice sorgente
COPY backend backend
COPY frontend frontend

# Variabili d'ambiente per build Next
# Il frontend userà sempre http://127.0.0.1:5000 per parlare col backend,
# cioè dentro il container.
ARG NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NODE_ENV=production

# Build del frontend (Next.js)
RUN cd frontend && npm run build

# Copia lo script di avvio
COPY start.sh .

# Permessi di esecuzione per lo script
RUN chmod +x start.sh

# Porta "documentativa": quella usata dal frontend (Next)
# In realtà Koyeb passerà la PORT da usare, ma per docker run locale
# di default Next userà la 3000.
EXPOSE 3000

# Comando di avvio: lancia sia backend che frontend
CMD ["./start.sh"]
