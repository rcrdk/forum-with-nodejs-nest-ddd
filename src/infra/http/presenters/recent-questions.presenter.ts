import { RecentQuestions } from '@/domain/forum/enterprise/entities/value-objects/recent-questions'

export class RecentQuestionsPresenter {
	static toHttp(details: RecentQuestions) {
		return {
			questionId: details.questionId.toString(),
			authorId: details.authorId.toString(),
			author: details.author,
			title: details.title,
			slug: details.slug.value,
			createdAt: details.createdAt,
			updatedAt: details.updatedAt,
		}
	}
}
