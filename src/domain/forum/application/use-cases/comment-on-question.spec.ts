import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { CommentOnQuestionUseCase } from './comment-on-question'

let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CommentOnQuestionUseCase

describe('comment on question', () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachementsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()

		// eslint-disable-next-line prettier/prettier
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()

		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
			inMemoryStudentsRepository,
		)
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		)

		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentsRepository,
		)
	})

	it('should be able to comment on question', async () => {
		const question = makeQuestion()

		await inMemoryQuestionsRepository.create(question)

		const result = await sut.execute({
			questionId: question.id.toString(),
			authorId: question.authorId.toString(),
			content: 'Comentário teste',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionCommentsRepository.items.at(0)?.content).toEqual(
			'Comentário teste',
		)
	})
})
