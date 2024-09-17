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

## 🔗 Routes
<!-- [![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Ignite%20Node.js%3A%20Forum%20API%20NestJS%0A&uri=https://raw.githubusercontent.com/rcrdk/forum-with-nodejs-nest-ddd/main/insomnia.json) -->

## ⚙️ Get started
```zsh
npm i
docker compose up -d

# Fill up enviroment variables
```
ß
<!--
	💡 **Tip:** Use ChatGPT:
	- Private and public keys: "How to generate RS256 private and public keys on [YOUR OS]"
	- Convert generated keys to base64: "How to convert file contents to base64 on [YOUR OS]"
-->

<!-- 🖥️ MacOS: -->
<!-- Generate RSA256 keys: -->
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
<!-- Convert keys to Base64: -->
base64 -i private_key.pem -o private_key.txt
base64 -i public_key.pem -o public_key.txt
