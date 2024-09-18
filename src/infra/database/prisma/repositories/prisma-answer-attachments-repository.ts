import { Injectable } from '@nestjs/common'

import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'

import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerAttachmentsRepository
	implements AnswerAttachmentsRepository
{
	constructor(private prisma: PrismaService) {}

	async findManyByAnswerId(id: string) {
		const attachments = await this.prisma.attachment.findMany({
			where: {
				answerId: id,
			},
		})

		return attachments.map((attachment) =>
			PrismaAnswerAttachmentMapper.toDomain(attachment),
		)
	}

	async deleteManyByAnswerId(id: string) {
		await this.prisma.attachment.deleteMany({
			where: {
				answerId: id,
			},
		})
	}
}
