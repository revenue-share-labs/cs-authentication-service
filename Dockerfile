FROM node:18-alpine

# Bundle app source
COPY . .

RUN npm install && \
    npm run prisma -- generate && \
    npm run build

# Expose port and start application
# EXPOSE 3010
# CMD [ "npm", "run", "start:prod" ]
