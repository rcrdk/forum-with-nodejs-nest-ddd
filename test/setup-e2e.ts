import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('Missing DATABASE_URL enviroment variable')
	}

	const url = new URL(process.env.DATABASE_URL)
	url.searchParams.set('schema', schema)

	return url.toString()
}

const schema = randomUUID()

beforeAll(async () => {
	const databaseURL = generateUniqueDatabaseURL(schema)

	process.env.DATABASE_URL = databaseURL
	execSync('npx prisma migrate deploy')
})

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
	await prisma.$disconnect()
})
