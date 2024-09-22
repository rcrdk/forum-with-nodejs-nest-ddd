/* eslint-disable prettier/prettier */
import { makeAnswer } from 'test/factories/make-answer'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments.repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('fetch question answers', () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachementsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
			inMemoryStudentsRepository,
			inMemoryAttachmentsRepository,
		)
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
	})

	it('should be able to fetch recent question answers', async () => {
		const student = makeStudent({ name: 'John Doe' })
		inMemoryStudentsRepository.items.push(student)

		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId('question-01'),
				authorId: student.id
			}),
		)
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId('question-01'),
				authorId: student.id
			}),
		)
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId('question-01'),
				authorId: student.id
			}),
		)

		const result = await sut.execute({
			questionId: 'question-01',
			page: 1,
			perPage: 20,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.answers).toHaveLength(3)
	})

	it('should be able to fetch paginated recent question answers', async () => {
		const student = makeStudent({ name: 'John Doe' })
		inMemoryStudentsRepository.items.push(student)

		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({
					questionId: new UniqueEntityId('question-01'),
					authorId: student.id,
				}),
			)
		}
		const result = await sut.execute({
			questionId: 'question-01',
			page: 2,
			perPage: 20,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.answers).toHaveLength(2)
	})
})
