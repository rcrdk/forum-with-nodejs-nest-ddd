import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('fetch question answers (e2e)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let answerFactory: AnswerFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		answerFactory = moduleRef.get(AnswerFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /questions/:questionId/answers', async () => {
		const user = await studentFactory.makePrismaStudent()
		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
		})

		await Promise.all([
			answerFactory.makePrismaAnswer({
				authorId: user.id,
				questionId: question.id,
				content: 'Answer 01',
			}),
			answerFactory.makePrismaAnswer({
				authorId: user.id,
				questionId: question.id,
				content: 'Answer 02',
			}),
		])

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.answers).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ content: 'Answer 02' }),
				expect.objectContaining({ content: 'Answer 01' }),
			]),
		)
	})
})
