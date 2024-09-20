import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('answer question (e2e)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let attachmentFactory: AttachmentFactory
	let prisma: PrismaService

	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AttachmentFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)
		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[POST] /questions/:questionId/answers', async () => {
		const user = await studentFactory.makePrismaStudent()
		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const attachment1 = await attachmentFactory.makePrismaAttachment()
		const attachment2 = await attachmentFactory.makePrismaAttachment()

		const response = await request(app.getHttpServer())
			.post(`/questions/${question.id.toString()}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'Yup, indeed i am!',
				attachments: [attachment1.id.toString(), attachment2.id.toString()],
			})

		expect(response.statusCode).toEqual(201)

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				content: 'Yup, indeed i am!',
			},
		})

		expect(answerOnDatabase).toBeTruthy()

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				answerId: answerOnDatabase?.id,
			},
		})

		expect(attachmentsOnDatabase).toHaveLength(2)
	})
})
