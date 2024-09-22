import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { InMemoryStudentsRepository } from './in-memory-students.repository'

// eslint-disable-next-line prettier/prettier
export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository
{
	public items: QuestionComment[] = []

	constructor(private studentsRepository: InMemoryStudentsRepository) {}

	async findById(id: string) {
		const questionComment = this.items.find(
			(comment) => comment.id.toString() === id,
		)

		return questionComment ?? null
	}

	async findManyByQuestionId(id: string, { page, perPage }: PaginationParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const questionComments = this.items
			.filter((item) => item.questionId.toString() === id)
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)

		return questionComments
	}

	// eslint-disable-next-line prettier/prettier
	async findManyByQuestionIdWithAuthor(id: string, { page, perPage }: PaginationParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const questionComments = this.items
			.filter((item) => item.questionId.toString() === id)
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

		return questionComments
	}

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment)
	}

	async delete(questionComment: QuestionComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		)

		this.items.splice(itemIndex, 1)
	}
}
