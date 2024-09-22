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
This project was coded to practice the development of an API using NestJS following the patterns of Domain-Driven Design (DDD)/Clean Architecture along with other patterns such as factory pattern and repositories pattern. It was [previously developed](https://github.com/rcrdk/ddd-in-nodejs) the core, domain entities, value objects, relationships, use cases, subdomains, domain events and unit tests. Along with NestJS and all its structure and concepts, it was used AWS-SDK to manage file storage with Cloudflare R2, it was applied cache concept using Redis on some routes. 

In this project it was ensured that all application works by running all test over testing simply with routes on Insomnia. It was applied unit tests and E2E tests. It was used Vitest along with supertest to make requests on tests. It was implemented GitHub Actions to run unit tests on push and E2E tests on pull requests. Prisma was used as ORM and client alongside with PostgreSQL database to mage with data. To make the authentication it was used JWT (JSON Web Token) to persist user information with security into the application.\

To get started with the flow of the application, you can register a new user and authenticate, or use data seeded to database after running migrations. Then, you are able to post questions, answer questions, you are also able to comment, fetch, edit or delete them (check out on Insomnia below).

## ⚙️ Get started

### 1️⃣ Install dependencies and run services:
<details>
<summary>Display contents</summary>
	
```shell
npm i
docker compose up -d
npx prisma migrate dev # seeds will run along
npx prisma studio
```
</details>

### 2️⃣ Generate JWT keys:
<details>
<summary>Display contents</summary>
	
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

</details>

### 3️⃣ Setup Cloudflare R2 services:
<details>
<summary>Display contents</summary>
	
It's need to create two Cloudflare R2 buckets, one for development and another for tests.
</details>

### 4️⃣ Set enviroment variables:
<details>
<summary>Display contents</summary>
	
Generate .env files for development and test. Then, set them up with Postgres database, Redis cache, JWT tokens and Cloudflare keys:

```shell
cp .env.example .env
cp .env.test.example .env.test
```
</details>

### 5️⃣ Run tests and start application:
<details>
<summary>Display contents</summary>
	
```shell
npm run test
npm run test:e2e
npm run start:dev
```
</details>

## 🔗 Routes
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Node.js%3A%20Forum%20API%20NestJS%0A&uri=https://raw.githubusercontent.com/rcrdk/forum-with-nodejs-nest-ddd/main/insomnia.json)
