import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

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

	async findManyByQuestionId(id: string, { page }: PaginationParams) {
		const ITEMS_PER_PAGE = 20
		const ITEMS_OFFSET_START = (page - 1) * ITEMS_PER_PAGE

		const questions = await this.prisma.comment.findMany({
			where: {
				questionId: id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: ITEMS_PER_PAGE,
			skip: ITEMS_OFFSET_START,
		})

		return questions.map((comment) =>
			PrismaQuestionCommentMapper.toDomain(comment),
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
