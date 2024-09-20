import {
	Attachment as PrismaAttachment,
	Question as PrismaQuestion,
	User as PrismaUser,
} from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

import { PrismaAttachmentMapper } from './prisma-attachment.mapper'

type PrismaQuestionDetails = PrismaQuestion & {
	author: PrismaUser
	attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
	static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
		return QuestionDetails.create({
			questionId: new UniqueEntityId(raw.id),
			authorId: new UniqueEntityId(raw.authorId),
			bestAnswerId: raw.bestAnswerId
				? new UniqueEntityId(raw.bestAnswerId)
				: null,
			author: raw.author.name,
			title: raw.title,
			slug: Slug.create(raw.slug),
			content: raw.content,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
			attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
		})
	}
}
