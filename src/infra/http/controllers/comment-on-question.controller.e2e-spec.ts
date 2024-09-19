import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('comment on question (e2e)', () => {
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

	test('[POST] /questions/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent()
		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const response = await request(app.getHttpServer())
			.post(`/questions/${question.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'First to comment!',
			})

		expect(response.statusCode).toEqual(201)

		const commentOnDatabase = await prisma.comment.findFirst({
			where: {
				content: 'First to comment!',
			},
		})

		expect(commentOnDatabase).toBeTruthy()
	})
})
