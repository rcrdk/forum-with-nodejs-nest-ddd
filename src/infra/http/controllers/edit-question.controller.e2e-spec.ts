import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('edit question (e2e)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[PUT] /questions/:id', async () => {
		const user = await studentFactory.makePrismaStudent({
			name: 'John Doe',
			email: 'john@doe.com',
			password: await hash('123456', 8),
		})

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
			content: 'In proident ipsum ullamco nostrud.',
		})

		const response = await request(app.getHttpServer())
			.put(`/questions/${question.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'Are you John Doe?',
				content: 'Esse occaecat excepteur nisi incididunt.',
			})

		expect(response.statusCode).toEqual(204)

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: 'Are you John Doe?',
			},
		})

		expect(questionOnDatabase).toBeTruthy()
	})
})
