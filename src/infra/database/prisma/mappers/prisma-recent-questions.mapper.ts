import { Question as PrismaQuestion, User as PrismaUser } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { RecentQuestions } from '@/domain/forum/enterprise/entities/value-objects/recent-questions'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

type PrismaRecentQuestions = PrismaQuestion & {
	author: PrismaUser
}

export class PrismaRecentQuestionsMapper {
	static toDomain(raw: PrismaRecentQuestions): RecentQuestions {
		return RecentQuestions.create({
			questionId: new UniqueEntityId(raw.id),
			authorId: new UniqueEntityId(raw.authorId),
			author: raw.author.name,
			title: raw.title,
			slug: Slug.create(raw.slug),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		})
	}
}
