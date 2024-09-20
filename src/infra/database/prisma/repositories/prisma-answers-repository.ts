import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { PrismaAnswerMapper } from '../mappers/prisma-answer.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
	constructor(
		private prisma: PrismaService,
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async findById(id: string) {
		const answer = await this.prisma.answer.findUnique({
			where: {
				id,
			},
		})

		if (!answer) {
			return null
		}

		return PrismaAnswerMapper.toDomain(answer)
	}

	async findManyByQuestionId(id: string, { page }: PaginationParams) {
		const ITEMS_PER_PAGE = 20
		const ITEMS_OFFSET_START = (page - 1) * ITEMS_PER_PAGE

		const answers = await this.prisma.answer.findMany({
			where: {
				questionId: id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: ITEMS_PER_PAGE,
			skip: ITEMS_OFFSET_START,
		})

		return answers.map((answer) => PrismaAnswerMapper.toDomain(answer))
	}

	async create(answer: Answer) {
		const data = PrismaAnswerMapper.toPrisma(answer)

		await this.prisma.answer.create({
			data,
		})

		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getItems(),
		)

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async save(answer: Answer) {
		const data = PrismaAnswerMapper.toPrisma(answer)

		await Promise.all([
			this.prisma.answer.update({
				where: { id: data.id },
				data,
			}),

			this.answerAttachmentsRepository.createMany(
				answer.attachments.getNewItems(),
			),

			this.answerAttachmentsRepository.deleteMany(
				answer.attachments.getRemovedItems(),
			),
		])

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async delete(answer: Answer) {
		await this.prisma.answer.delete({
			where: { id: answer.id.toString() },
		})
	}
}
