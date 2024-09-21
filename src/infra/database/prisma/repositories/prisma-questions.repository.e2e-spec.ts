import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository'
import { AppModule } from '@/infra/app.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { CacheRepository } from '@/infra/cache/cache.repository'
import { DatabaseModule } from '@/infra/database/database.module'

describe('prisma questions repository (e2e)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let attachmentFactory: AttachmentFactory
	let questionAtachmentFactory: QuestionAttachmentFactory
	let cacheRepository: CacheRepository
	let questionsRepository: QuestionsRepository

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule, CacheModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()

		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)
		questionAtachmentFactory = moduleRef.get(QuestionAttachmentFactory)
		cacheRepository = moduleRef.get(CacheRepository)
		questionsRepository = moduleRef.get(QuestionsRepository)

		await app.init()
	})

	it('should cache questions details', async () => {
		const user = await studentFactory.makePrismaStudent()

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const attachment = await attachmentFactory.makePrismaAttachment()

		await questionAtachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		})

		const slug = question.slug.value

		// eslint-disable-next-line prettier/prettier
		const questionDetails = await questionsRepository.findBySlugWithDetails(slug)

		const cached = await cacheRepository.get(`question:${slug}:details`)

		if (!cached) {
			throw new Error()
		}

		expect(JSON.parse(cached)).toEqual(
			expect.objectContaining({
				id: questionDetails?.questionId.toString(),
			}),
		)
	})

	it('should return cached questions details on subsequent calls', async () => {
		const user = await studentFactory.makePrismaStudent()

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const attachment = await attachmentFactory.makePrismaAttachment()

		await questionAtachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		})

		const slug = question.slug.value

		let cached = await cacheRepository.get(`question:${slug}:details`)

		expect(cached).toBeNull()

		await questionsRepository.findBySlugWithDetails(slug)

		cached = await cacheRepository.get(`question:${slug}:details`)

		expect(cached).not.toBeNull()

		if (!cached) {
			throw new Error()
		}

		// eslint-disable-next-line prettier/prettier
		const questionDetails = await questionsRepository.findBySlugWithDetails(slug)

		expect(JSON.parse(cached)).toEqual(
			expect.objectContaining({
				id: questionDetails?.questionId.toString(),
			}),
		)
	})

	it('should reset question details cache when saving the question', async () => {
		const user = await studentFactory.makePrismaStudent()

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const attachment = await attachmentFactory.makePrismaAttachment()

		await questionAtachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		})

		const slug = question.slug.value

		await cacheRepository.set(
			`question:${slug}:details`,
			JSON.stringify({ empty: true }),
		)

		await questionsRepository.save(question)

		const cached = await cacheRepository.get(`question:${slug}:details`)

		expect(cached).toBeNull()
	})
})
