import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('fetch recent questions', () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachementsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		// eslint-disable-next-line prettier/prettier
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		)

		sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to fetch recent questions', async () => {
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date(2024, 8, 20),
			}),
		)

		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date(2024, 8, 18),
			}),
		)

		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date(2024, 8, 23),
			}),
		)

		const result = await sut.execute({
			page: 1,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.questions).toEqual([
			expect.objectContaining({
				createdAt: new Date(2024, 8, 23),
			}),
			expect.objectContaining({
				createdAt: new Date(2024, 8, 20),
			}),
			expect.objectContaining({
				createdAt: new Date(2024, 8, 18),
			}),
		])
	})

	it('should be able to fetch paginated recent questions', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionsRepository.create(makeQuestion())
		}

		const result = await sut.execute({
			page: 2,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.questions).toHaveLength(2)
	})
})
