import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	// create users
	const studentOne = await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'student@student.com',
			password: await hash('12345', 8),
			role: 'STUDENT',
		},
	})

	const studentTwo = await prisma.user.create({
		data: {
			name: 'Fred Smith',
			email: 'another@another.com',
			password: await hash('12345', 8),
			role: 'STUDENT',
		},
	})

	await prisma.user.create({
		data: {
			name: 'Janet Does',
			email: 'instructor@instructor.com',
			password: await hash('12345', 8),
			role: 'INSTRUCTOR',
		},
	})

	// questions
	const questionOne = await prisma.question.create({
		data: {
			title: faker.lorem.sentence(),
			content: faker.lorem.sentence(),
			slug: faker.lorem.slug(),
			authorId: studentOne.id,
		},
	})

	const questionTwo = await prisma.question.create({
		data: {
			title: faker.lorem.sentence(),
			content: faker.lorem.sentence(),
			slug: faker.lorem.slug(),
			authorId: studentTwo.id,
		},
	})

	// questions comments
	await prisma.comment.createMany({
		data: [
			{
				content: faker.lorem.sentence(),
				authorId: studentOne.id,
				questionId: questionOne.id,
			},
			{
				content: faker.lorem.sentence(),
				authorId: studentTwo.id,
				questionId: questionOne.id,
			},
			{
				content: faker.lorem.sentence(),
				authorId: studentOne.id,
				questionId: questionTwo.id,
			},
			{
				content: faker.lorem.sentence(),
				authorId: studentTwo.id,
				questionId: questionTwo.id,
			},
		],
	})

	// answers
	const answerQuestionOne = await prisma.answer.create({
		data: {
			content: faker.lorem.sentence(),
			questionId: questionOne.id,
			authorId: studentTwo.id,
		},
	})

	const answerQuestionTwo = await prisma.answer.create({
		data: {
			content: faker.lorem.sentence(),
			questionId: questionTwo.id,
			authorId: studentOne.id,
		},
	})

	// answers comments
	await prisma.comment.createMany({
		data: [
			{
				content: faker.lorem.sentence(),
				authorId: studentOne.id,
				answerId: answerQuestionOne.id,
			},
			{
				content: faker.lorem.sentence(),
				authorId: studentTwo.id,
				answerId: answerQuestionOne.id,
			},
			{
				content: faker.lorem.sentence(),
				authorId: studentOne.id,
				answerId: answerQuestionTwo.id,
			},
			{
				content: faker.lorem.sentence(),
				authorId: studentTwo.id,
				answerId: answerQuestionTwo.id,
			},
		],
	})

	await prisma.question.update({
		where: {
			id: questionOne.id,
		},
		data: {
			bestAnswerId: answerQuestionOne.id,
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
