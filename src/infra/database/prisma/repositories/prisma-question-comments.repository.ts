import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author.mapper'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
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

		return PrismaQuestionCommentMapper.toDomain(comment)
	}

	async findManyByQuestionId(id: string, { page, perPage }: PaginationParams) {
		const questions = await this.prisma.comment.findMany({
			where: {
				questionId: id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		return questions.map((comment) =>
			PrismaQuestionCommentMapper.toDomain(comment),
		)
	}

	async findManyByQuestionIdWithAuthor(
		id: string,
		{ page, perPage }: PaginationParams,
	) {
		const questions = await this.prisma.comment.findMany({
			where: {
				questionId: id,
			},
			include: {
				author: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		return questions.map((comment) =>
			PrismaCommentWithAuthorMapper.toDomain(comment),
		)
	}

	async create(comment: QuestionComment) {
		const data = PrismaQuestionCommentMapper.toPrisma(comment)

		await this.prisma.comment.create({
			data,
		})
	}

	async delete(comment: QuestionComment) {
		await this.prisma.comment.delete({
			where: { id: comment.id.toString() },
		})
	}
}
