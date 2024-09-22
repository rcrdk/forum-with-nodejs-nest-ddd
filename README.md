<!-- TO_DO
- About the project
- add tests on github worflow [commit, pr]
- prepare for ci
-->

# 💬 Forum API in NestJS with DDD and Clean Architecture
I developed this project during my latest studies on Node lessons at [Rocketseat](https://www.rocketseat.com.br).

## 🚀 Techs and Tools
- [Node.js v18](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io) / [PostgreSQL](https://www.postgresql.org/)  / [Docker](https://www.docker.com/)
- [Cloudflare R2](https://www.cloudflare.com/pt-br/) + [AWS SDK](https://github.com/aws/aws-sdk-js-v3)
- [Redis](https://redis.io) + [ioredis](https://github.com/redis/ioredis)
- [Insomnia](https://insomnia.rest/)
- [Vitest](https://vitest.dev/)

## 🖥️ Project
<!-- This project was developed to practice the Domain-Driven Design (DDD) and Clean Architecture in Node.js. It was developed from the core domain, to base entities, to value objects, to relationships, to use cases, to subdomains, to domain events and unit tests. -->

## ⚙️ Get started

### 1️⃣ Install dependencies and run services:
```shell
npm i

docker compose up -d

npx prisma migrate dev # seeds will run along
npx prisma studio
```

---

### 2️⃣ Generate JWT keys:
```shell
# Generate RSA256 secret and public keys: (Requires OpenSSL installed)
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem

# Convert keys to Base64: (MacOS/Linux)
base64 -i private_key.pem -o private_key.txt
base64 -i public_key.pem -o public_key.txt
```

> [!TIP]
> **Use ChatGPT:**<br />
> 1) Private and public keys: "How to generate RS256 private and public keys on [YOUR OS]"<br />
> 2) Convert generated keys to base64: "How to convert file contents to base64 on [YOUR OS]"

---

### 3️⃣ Setup Cloudflare R2 services:
It's need to create two Cloudflare R2 buckets, one for development and another for tests.

---

### 4️⃣ Set enviroment variables:
Generate .env files for development and test. Then, set them up with Postgres database, Redis cache, JWT tokens and Cloudflare keys:

```shell
cp .env.example .env
cp .env.test.example .env.test
```

---

### 5️⃣ Run tests and start application:
```shell
npm run test
npm run test:e2e
npm run start:dev
```

## 🔗 Routes
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Node.js%3A%20Forum%20API%20NestJS%0A&uri=https://raw.githubusercontent.com/rcrdk/forum-with-nodejs-nest-ddd/main/insomnia.json)