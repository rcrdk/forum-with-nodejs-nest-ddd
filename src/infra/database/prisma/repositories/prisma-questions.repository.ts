import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { CacheRepository } from '@/infra/cache/cache.repository'

import { PrismaQuestionMapper } from '../mappers/prisma-question.mapper'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details.mapper'
import { PrismaRecentQuestionsMapper } from '../mappers/prisma-recent-questions.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(
		private prisma: PrismaService,
		private cacheRepository: CacheRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}

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

	async findBySlugWithDetails(slug: string) {
		const cacheHit = await this.cacheRepository.get(`question:${slug}:details`)

		if (cacheHit) {
			const cachedData = JSON.parse(cacheHit)
			return PrismaQuestionDetailsMapper.toDomain(cachedData)
		}

		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
			include: {
				author: true,
				attachments: true,
			},
		})

		if (!question) {
			return null
		}

		await this.cacheRepository.set(
			`question:${slug}:details`,
			JSON.stringify(question),
		)

		return PrismaQuestionDetailsMapper.toDomain(question)
	}

	async findManyRecent({ page, perPage }: PaginationParams) {
		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		return questions.map((question) => PrismaQuestionMapper.toDomain(question))
	}

	async findManyRecentWithAuthor({ page, perPage }: PaginationParams) {
		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				author: true,
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		return questions.map((question) =>
			PrismaRecentQuestionsMapper.toDomain(question),
		)
	}

	async create(question: Question) {
		const data = PrismaQuestionMapper.toPrisma(question)

		await this.prisma.question.create({
			data,
		})

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems(),
		)

		DomainEvents.dispatchEventsForAggregate(question.id)
	}

	async save(question: Question) {
		const data = PrismaQuestionMapper.toPrisma(question)

		await Promise.all([
			this.prisma.question.update({
				where: { id: data.id },
				data,
			}),
			this.questionAttachmentsRepository.createMany(
				question.attachments.getNewItems(),
			),
			this.questionAttachmentsRepository.deleteMany(
				question.attachments.getRemovedItems(),
			),
			this.cacheRepository.delete(`question:${data.slug}:details`),
		])

		DomainEvents.dispatchEventsForAggregate(question.id)
	}

	async delete(question: Question) {
		await this.prisma.question.delete({
			where: { id: question.id.toString() },
		})
	}
}
