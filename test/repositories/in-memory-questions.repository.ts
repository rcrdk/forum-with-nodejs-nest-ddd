import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { RecentQuestions } from '@/domain/forum/enterprise/entities/value-objects/recent-questions'

import { InMemoryAttachementsRepository } from './in-memory-attatchments.repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments.repository'
import { InMemoryStudentsRepository } from './in-memory-students.repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = []

	constructor(
		private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
		private attachmentsRepository: InMemoryAttachementsRepository,
		private studentsRepository: InMemoryStudentsRepository,
	) {}

	async findById(id: string) {
		const question = this.items.find(
			(question) => question.id.toString() === id,
		)

		return question ?? null
	}

	async findBySlug(slug: string) {
		const question = this.items.find((question) => question.slug.value === slug)

		return question ?? null
	}

	async findBySlugWithDetails(slug: string) {
		const question = this.items.find((question) => question.slug.value === slug)

		if (!question) {
			return null
		}

		const author = this.studentsRepository.items.find((student) =>
			student.id.equals(question.authorId),
		)

		if (!author) {
			throw new Error(
				`Author with id "${question.toString()}" does not exists.`,
			)
		}

		const questionAttachments = this.questionAttachmentsRepository.items.filter(
			(item) => item.questionId.equals(question.id),
		)

		const attachments = questionAttachments.map((item) => {
			const attachment = this.attachmentsRepository.items.find((attachment) =>
				attachment.id.equals(item.attachmentId),
			)

			if (!attachment) {
				throw new Error(
					`Attachment with id "${item.attachmentId.toString()}" does not exists.`,
				)
			}

			return attachment
		})

		return QuestionDetails.create({
			questionId: question.id,
			authorId: question.authorId,
			author: author.name,
			title: question.title,
			slug: question.slug,
			content: question.content,
			bestAnswerId: question.bestAnswerId,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
			attachments,
		})
	}

	async findManyRecent({ page, perPage }: PaginationParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)

		return questions
	}

	async findManyRecentWithAuthor({ page, perPage }: PaginationParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)
			.map((question) => {
				const author = this.studentsRepository.items.find((student) =>
					student.id.equals(question.authorId),
				)

				if (!author) {
					throw new Error(
						`Author with id "${question.authorId.toString()}" does not exists.`,
					)
				}
				return RecentQuestions.create({
					questionId: question.id,
					authorId: question.authorId,
					title: question.title,
					slug: question.slug,
					createdAt: question.createdAt,
					updatedAt: question.updatedAt,
					author: author?.name,
				})
			})

		return questions
	}

	async create(question: Question) {
		this.items.push(question)

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems(),
		)

		DomainEvents.dispatchEventsForAggregate(question.id)
	}

	async save(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id)

		this.items[itemIndex] = question

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getNewItems(),
		)

		await this.questionAttachmentsRepository.deleteMany(
			question.attachments.getRemovedItems(),
		)

		DomainEvents.dispatchEventsForAggregate(question.id)
	}

	async delete(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id)

		this.items.splice(itemIndex, 1)
		this.questionAttachmentsRepository.deleteManyByQuestionId(
			question.id.toString(),
		)
	}
}
