import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

import { AttachmentPresenter } from './attachment.presenter'

export class QuestionDetailsPresenter {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static toHttp(details: QuestionDetails) {
		return {
			questionId: details.questionId.toString(),
			authorId: details.authorId.toString(),
			bestAnswerId: details.bestAnswerId?.toString(),
			author: details.author,
			title: details.title,
			slug: details.slug.value,
			content: details.content,
			createdAt: details.createdAt,
			updatedAt: details.updatedAt,
			attachments: details.attachments.map(AttachmentPresenter.toHttp),
		}
	}
}
