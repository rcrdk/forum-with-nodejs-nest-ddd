import { Injectable } from '@nestjs/common'

import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private prisma: PrismaService) {}

	async createMany(attachments: QuestionAttachment[]) {
		if (attachments.length === 0) {
			return
		}

		const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

		await this.prisma.attachment.updateMany(data)
	}

	async deleteMany(attachments: QuestionAttachment[]) {
		if (attachments.length === 0) {
			return
		}

		const attachmentsIds = attachments.map((item) => item.id.toString())

		await this.prisma.attachment.deleteMany({
			where: {
				id: {
					in: attachmentsIds,
				},
			},
		})
	}

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
