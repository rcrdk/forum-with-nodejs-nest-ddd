import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('create question (e2e)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		studentFactory = moduleRef.get(StudentFactory)
		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[POST] /questions', async () => {
		const user = await studentFactory.makePrismaStudent()
		const accessToken = jwt.sign({ sub: user.id.toString() })

		const response = await request(app.getHttpServer())
			.post('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'Are you John Doe?',
				content: 'Esse occaecat excepteur nisi incididunt.',
			})

		expect(response.statusCode).toEqual(201)

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: 'Are you John Doe?',
			},
		})

		expect(questionOnDatabase).toBeTruthy()
	})
})
