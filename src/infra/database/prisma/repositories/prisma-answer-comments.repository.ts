import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment.mapper'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	constructor(private prisma: PrismaService) {}

	async findById(id: string) {
		const comment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		})

		if (!comment) {
			return null
		}

		return PrismaAnswerCommentMapper.toDomain(comment)
	}

	async findManyByAnswerId(id: string, { page }: PaginationParams) {
		const ITEMS_PER_PAGE = 20
		const ITEMS_OFFSET_START = (page - 1) * ITEMS_PER_PAGE

		const questions = await this.prisma.comment.findMany({
			where: {
				answerId: id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: ITEMS_PER_PAGE,
			skip: ITEMS_OFFSET_START,
		})

		return questions.map((comment) =>
			PrismaAnswerCommentMapper.toDomain(comment),
		)
	}

	async findManyByAnswerIdWithAuthor(id: string, { page }: PaginationParams) {
		const ITEMS_PER_PAGE = 20
		const ITEMS_OFFSET_START = (page - 1) * ITEMS_PER_PAGE

		const questions = await this.prisma.comment.findMany({
			where: {
				answerId: id,
			},
			include: {
				author: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: ITEMS_PER_PAGE,
			skip: ITEMS_OFFSET_START,
		})

		return questions.map((comment) =>
			PrismaCommentWithAuthorMapper.toDomain(comment),
		)
	}

	async create(comment: AnswerComment) {
		const data = PrismaAnswerCommentMapper.toPrisma(comment)

		await this.prisma.comment.create({
			data,
		})
	}

	async delete(comment: AnswerComment) {
		await this.prisma.comment.delete({
			where: { id: comment.id.toString() },
		})
	}
}
