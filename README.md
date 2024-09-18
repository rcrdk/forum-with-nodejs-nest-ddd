# 💬 Simple Forum API with DDD
I developed this project during my latest studies on Node lessons at [Rocketseat](https://www.rocketseat.com.br).

## 🚀 Techs and Tools
- [Node.js v18](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io) / [PostgreSQL](https://www.postgresql.org/)  / [Docker](https://www.docker.com/)
- [Insomnia](https://insomnia.rest/)
- [Vitest](https://vitest.dev/)

## 🖥️ Project
<!-- This project was developed to practice the Domain-Driven Design (DDD) and Clean Architecture in Node.js. It was developed from the core domain, to base entities, to value objects, to relationships, to use cases, to subdomains, to domain events and unit tests. -->

<!-- Base domains: https://github.com/rcrdk/ddd-in-nodejs -->

## 🔗 Routes
<!-- [![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Node.js%3A%20Forum%20API%20NestJS%0A&uri=https://raw.githubusercontent.com/rcrdk/forum-with-nodejs-nest-ddd/main/insomnia.json) -->

## ⚙️ Get started
```shell
npm i
docker compose up -d

# Generate RSA256 secret and public keys: (Requires OpenSSL installed)
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem

# Convert keys to Base64: (MacOS/Linux)
base64 -i private_key.pem -o private_key.txt
base64 -i public_key.pem -o public_key.txt

# Set enviroment variables:
cp .env.example .env.local

npm run test
npm run test:e2e
npm run start:dev
```

> [!TIP]
> **Use ChatGPT:**<br />
> 1) Private and public keys: "How to generate RS256 private and public keys on [YOUR OS]"<br />
> 2) Convert generated keys to base64: "How to convert file contents to base64 on [YOUR OS]"