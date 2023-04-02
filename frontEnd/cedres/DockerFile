FROM node:latest as builder
WORKDIR /app
COPY . .


FROM node:latest
WORKDIR /app
COPY ./server.cjs .
RUN npm install express
COPY --from=builder /app/dist/ /app/dist
ENTRYPOINT [ "node", "./server.cjs" ]