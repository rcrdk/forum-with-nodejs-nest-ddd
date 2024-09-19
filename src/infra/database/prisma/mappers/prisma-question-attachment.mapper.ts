import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class PrismaQuestionAttachmentMapper {
	static toDomain(raw: PrismaAttachment): QuestionAttachment {
		if (!raw.questionId) {
			throw new Error('Invalid attachment type.')
		}

		return QuestionAttachment.create(
			{
				attachmentId: new UniqueEntityId(raw.id),
				questionId: new UniqueEntityId(raw.questionId),
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrismaUpdateMany(
		attachments: QuestionAttachment[],
	): Prisma.AttachmentUpdateManyArgs {
		const attachmentsIds = attachments.map((item) =>
			item.attachmentId.toString(),
		)

		return {
			where: {
				id: {
					in: attachmentsIds,
				},
			},
			data: {
				questionId: attachments.at(0)?.questionId.toString(),
			},
		}
	}
}
