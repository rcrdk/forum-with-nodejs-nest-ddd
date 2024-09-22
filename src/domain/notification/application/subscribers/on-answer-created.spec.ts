/* eslint-disable prettier/prettier */
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments.repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from '../use-cases/send-notification'
import { OnAnswerCreated } from './on-answer-created'

let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<(request: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>>

describe('on answer created', () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachementsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionsAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository
		)
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
			inMemoryStudentsRepository,
			inMemoryAttachmentsRepository,
		)
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

		// eslint-disable-next-line no-new
		new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
	})

	it('should send a notification when an answer is created', async () => {
		const question = makeQuestion()
		const answer = makeAnswer({ questionId: question.id })

		await inMemoryQuestionsRepository.create(question)
		await inMemoryAnswersRepository.create(answer)

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toHaveBeenCalled()
		})

	})
})
