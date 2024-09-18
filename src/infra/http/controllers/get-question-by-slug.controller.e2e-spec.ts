import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('fetch question by slug (e2e)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /questions/:slug', async () => {
		const user = await studentFactory.makePrismaStudent({
			name: 'John Doe',
			email: 'john@doe.com',
			password: await hash('123456', 8),
		})

		const accessToken = jwt.sign({ sub: user.id.toString() })

		await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question 01',
			slug: Slug.create('question-01'),
			content: 'In proident ipsum ullamco nostrud.',
		})

		const response = await request(app.getHttpServer())
			.get('/questions/question-01')
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.question).toMatchObject({ title: 'Question 01' })
	})
})
