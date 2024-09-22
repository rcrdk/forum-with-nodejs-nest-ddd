import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author'

import { AttachmentPresenter } from './attachment.presenter'

export class AnswerWithAuhtorPresenter {
	static toHttp(details: AnswerWithAuthor) {
		return {
			answerId: details.answerId.toString(),
			authorId: details.authorId.toString(),
			author: details.author,
			content: details.content,
			createdAt: details.createdAt,
			updatedAt: details.updatedAt,
			attachments: details.attachments.map(AttachmentPresenter.toHttp),
		}
	}
}
