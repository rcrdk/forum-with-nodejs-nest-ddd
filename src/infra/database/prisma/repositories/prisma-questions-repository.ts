import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

import { PrismaQuestionMapper } from '../mappers/prisma-question.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(private prisma: PrismaService) {}

	async findById(id: string) {
		const question = await this.prisma.question.findUnique({
			where: {
				id,
			},
		})

		if (!question) {
			return null
		}

		return PrismaQuestionMapper.toDomain(question)
	}

	async findBySlug(slug: string) {
		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
		})

		if (!question) {
			return null
		}

		return PrismaQuestionMapper.toDomain(question)
	}

	async findManyRecent({ page }: PaginationParams) {
		const ITEMS_PER_PAGE = 20
		const ITEMS_OFFSET_START = (page - 1) * ITEMS_PER_PAGE

		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take: ITEMS_PER_PAGE,
			skip: ITEMS_OFFSET_START,
		})

		return questions.map((question) => PrismaQuestionMapper.toDomain(question))
	}

	async create(question: Question) {
		const data = PrismaQuestionMapper.toPrisma(question)

		await this.prisma.question.create({
			data,
		})
	}

	async save(question: Question) {
		const data = PrismaQuestionMapper.toPrisma(question)

		await this.prisma.question.update({
			where: { id: data.id },
			data,
		})
	}

	async delete(question: Question) {
		await this.prisma.question.delete({
			where: { id: question.id.toString() },
		})
	}
}
