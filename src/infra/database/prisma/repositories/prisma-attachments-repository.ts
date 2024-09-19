import { Injectable } from '@nestjs/common'

import { AttachemntsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

import { PrismaAttachmentMapper } from '../mappers/prisma-attachment.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttachmentsRepository implements AttachemntsRepository {
	constructor(private prisma: PrismaService) {}

	async create(attachemnt: Attachment) {
		const data = PrismaAttachmentMapper.toPrisma(attachemnt)

		await this.prisma.attachment.create({
			data,
		})
	}
}
