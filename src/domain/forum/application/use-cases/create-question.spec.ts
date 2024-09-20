import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CreateQuestionUseCase } from './create-question'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('create question', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		// eslint-disable-next-line prettier/prettier
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryAttachmentsRepository = new InMemoryAttachementsRepository()
		// eslint-disable-next-line prettier/prettier
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		)
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to create a question', async () => {
		const result = await sut.execute({
			authorId: 'author-01',
			title: 'Que dia é hoje?',
			content: 'Amnésia pura',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionsRepository.items.at(0)).toEqual(
			result.value?.question,
		)
		expect(
			inMemoryQuestionsRepository.items.at(0)?.attachments.currentItems,
		).toHaveLength(2)
		expect(
			inMemoryQuestionsRepository.items.at(0)?.attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		])
	})

	it('should persist attachemnts when creating a question', async () => {
		const result = await sut.execute({
			authorId: 'author-01',
			title: 'Que dia é hoje?',
			content: 'Amnésia pura',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)

		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		])
	})
})
