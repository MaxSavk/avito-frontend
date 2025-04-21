# Этап сборки
FROM golang:1.24.1-alpine AS builder

RUN apk add --no-cache git gcc musl-dev sqlite-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 GOOS=linux go build -v -o /app/main ./cmd/service

# Финальный образ
FROM alpine:latest

RUN apk add --no-cache sqlite

COPY --from=builder /app/main /main

EXPOSE 8080

CMD ["/main"]
