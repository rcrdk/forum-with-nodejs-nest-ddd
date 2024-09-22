import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { PrismaAnswerMapper } from '../mappers/prisma-answer.mapper'
import { PrismaAnswerWithUserMapper } from '../mappers/prisma-answer-with-author.mapper'
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

	async findManyByQuestionId(id: string, { page, perPage }: PaginationParams) {
		const answers = await this.prisma.answer.findMany({
			where: {
				questionId: id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		return answers.map((answer) => PrismaAnswerMapper.toDomain(answer))
	}

	async findManyByQuestionIdWithAuthor(
		id: string,
		{ page, perPage }: PaginationParams,
	) {
		const answers = await this.prisma.answer.findMany({
			where: {
				questionId: id,
			},
			include: {
				author: true,
				attachments: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		return answers.map((answer) => PrismaAnswerWithUserMapper.toDomain(answer))
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
