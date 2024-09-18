import { Injectable } from '@nestjs/common'

import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'

import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private prisma: PrismaService) {}

	async findManyByQuestionId(id: string) {
		const attachments = await this.prisma.attachment.findMany({
			where: {
				questionId: id,
			},
		})

		return attachments.map((attachment) =>
			PrismaQuestionAttachmentMapper.toDomain(attachment),
		)
	}

	async deleteManyByQuestionId(id: string) {
		await this.prisma.attachment.deleteMany({
			where: {
				questionId: id,
			},
		})
	}
}
