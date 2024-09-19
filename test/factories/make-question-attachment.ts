import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	QuestionAttachment,
	QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeQuestionAttachment(
	override: Partial<QuestionAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const questionComment = QuestionAttachment.create(
		{
			questionId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	)

	return questionComment
}

@Injectable()
export class QuestionAttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestionAttachment(
		data: Partial<QuestionAttachmentProps> = {},
	): Promise<QuestionAttachment> {
		const questionAttachment = makeQuestionAttachment(data)

		await this.prisma.attachment.update({
			where: {
				id: questionAttachment.attachmentId.toString(),
			},
			data: {
				questionId: questionAttachment.questionId.toString(),
			},
		})

		return questionAttachment
	}
}
