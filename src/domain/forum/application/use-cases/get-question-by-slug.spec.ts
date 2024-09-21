import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments.repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository'

import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('get question by slug', () => {
	beforeEach(() => {
		// eslint-disable-next-line prettier/prettier
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryAttachmentsRepository = new InMemoryAttachementsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		)
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to get a question by slug', async () => {
		const student = makeStudent({ name: 'John Doe' })
		inMemoryStudentsRepository.items.push(student)

		const newQuestion = makeQuestion({
			authorId: student.id,
			slug: Slug.create('example-question-01'),
		})

		await inMemoryQuestionsRepository.create(newQuestion)

		const attachment = makeAttachment({
			title: 'Some attachment',
		})

		inMemoryAttachmentsRepository.items.push(attachment)
		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id,
			}),
		)

		const result = await sut.execute({
			slug: 'example-question-01',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: 'John Doe',
				attachments: [
					expect.objectContaining({
						title: 'Some attachment',
					}),
				],
			}),
		})
	})
})
