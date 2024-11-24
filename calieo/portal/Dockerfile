
FROM golang:1.21

EXPOSE 6001

WORKDIR /data

COPY build/multiverse-authorization ./
COPY runtime ./runtime

CMD ["./multiverse-authorization", "-config", "runtime/config.yaml"]
