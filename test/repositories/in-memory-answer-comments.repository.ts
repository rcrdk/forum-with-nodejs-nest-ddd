import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { InMemoryStudentsRepository } from './in-memory-students.repository'

// eslint-disable-next-line prettier/prettier
export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository
{
	public items: AnswerComment[] = []

	constructor(private studentsRepository: InMemoryStudentsRepository) {}

	async findById(id: string) {
		const answerComment = this.items.find(
			(comment) => comment.id.toString() === id,
		)

		return answerComment ?? null
	}

	async findManyByAnswerId(id: string, { page, perPage }: PaginationParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const answerComments = this.items
			.filter((item) => item.answerId.toString() === id)
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)

		return answerComments
	}

	// eslint-disable-next-line prettier/prettier
	async findManyByAnswerIdWithAuthor(id: string, { page, perPage }: PaginationParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const answerComments = this.items
			.filter((item) => item.answerId.toString() === id)
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)
			.map((comment) => {
				const author = this.studentsRepository.items.find((student) =>
					student.id.equals(comment.authorId),
				)

				if (!author) {
					throw new Error(
						`Author with id "${comment.authorId.toString()}" does not exists.`,
					)
				}

				return CommentWithAuthor.create({
					commentId: comment.id,
					content: comment.content,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
					authorId: comment.authorId,
					author: author?.name,
				})
			})

		return answerComments
	}

	async create(answerComment: AnswerComment) {
		this.items.push(answerComment)
	}

	async delete(answerComment: AnswerComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id === answerComment.id,
		)

		this.items.splice(itemIndex, 1)
	}
}
