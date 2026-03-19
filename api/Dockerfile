FROM node:22-alpine

WORKDIR /app

COPY server.js .

EXPOSE 2999

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:2999/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
