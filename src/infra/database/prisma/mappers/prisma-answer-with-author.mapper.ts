import {
	Answer as PrismaAnswer,
	Attachment as PrismaAttachment,
	User as PrismaUser,
} from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'

import { PrismaAttachmentMapper } from './prisma-attachment.mapper'

type PrismaAnswerDetails = PrismaAnswer & {
	author: PrismaUser
	attachments: PrismaAttachment[]
}

export class PrismaAnswerWithUserMapper {
	static toDomain(raw: PrismaAnswerDetails): AnswerWithAuthor {
		return AnswerWithAuthor.create({
			answerId: new UniqueEntityId(raw.id),
			authorId: new UniqueEntityId(raw.authorId),
			author: raw.author.name,
			content: raw.content,
			attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		})
	}
}
