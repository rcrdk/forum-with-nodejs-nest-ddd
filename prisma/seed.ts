import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	// create users
	await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'admin@admin.com',
			password: '123456',
		},
	})

	await prisma.user.create({
		data: {
			name: 'Janet Does',
			email: 'user@user.com',
			password: '123456',
		},
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
