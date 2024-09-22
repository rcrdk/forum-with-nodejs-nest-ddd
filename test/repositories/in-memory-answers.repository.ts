import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'

import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments.repository'
import { InMemoryAttachementsRepository } from './in-memory-attatchments.repository'
import { InMemoryStudentsRepository } from './in-memory-students.repository'

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = []

	constructor(
		private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
		private studentsRepository: InMemoryStudentsRepository,
		private attachmentsRepository: InMemoryAttachementsRepository,
	) {}

	async findById(id: string) {
		const answer = this.items.find((answer) => answer.id.toString() === id)

		return answer ?? null
	}

	async findManyByQuestionId(id: string, { page, perPage }: PaginationParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const answers = this.items
			.filter((item) => item.questionId.toString() === id)
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)

		return answers
	}

	// eslint-disable-next-line prettier/prettier
	async findManyByQuestionIdWithAuthor(id: string, { page, perPage }: PaginationParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const answers = this.items
			.filter((item) => item.questionId.toString() === id)
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)
			.map((answer) => {
				const author = this.studentsRepository.items.find((student) =>
					student.id.equals(answer.authorId),
				)

				if (!author) {
					throw new Error(
						`Author with id "${answer.authorId.toString()}" does not exists.`,
					)
				}

				const answerAttachments = this.answerAttachmentsRepository.items.filter(
					(item) => item.answerId.equals(answer.id),
				)

				const attachments = answerAttachments.map((item) => {
					const attachment = this.attachmentsRepository.items.find(
						(attachment) => attachment.id.equals(item.attachmentId),
					)

					if (!attachment) {
						throw new Error(
							`Attachment with id "${item.attachmentId.toString()}" does not exists.`,
						)
					}

					return attachment
				})

				return AnswerWithAuthor.create({
					answerId: answer.id,
					authorId: answer.authorId,
					content: answer.content,
					createdAt: answer.createdAt,
					updatedAt: answer.updatedAt,
					author: author?.name,
					attachments,
				})
			})

		return answers
	}

	async create(answer: Answer) {
		this.items.push(answer)

		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getItems(),
		)

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async save(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id)

		this.items[itemIndex] = answer

		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getNewItems(),
		)

		await this.answerAttachmentsRepository.deleteMany(
			answer.attachments.getRemovedItems(),
		)

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async delete(answer: Answer) {
		const itemIndex = this.items.findIndex((item) => item.id === answer.id)

		this.items.splice(itemIndex, 1)
		this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
	}
}
