import { Comment as PrismaComment, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class PrismaAnswerCommentMapper {
	static toDomain(raw: PrismaComment): AnswerComment {
		if (!raw.answerId) {
			throw new Error('Invalid comment type.')
		}

		return AnswerComment.create(
			{
				content: raw.content,
				authorId: new UniqueEntityId(raw.authorId),
				answerId: new UniqueEntityId(raw.answerId),
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(comment: AnswerComment): Prisma.CommentUncheckedCreateInput {
		return {
			id: comment.id.toString(),
			authorId: comment.authorId.toString(),
			answerId: comment.answerId.toString(),
			content: comment.content,
			createdAt: comment.createdAt,
			updatedAt: comment.updatedAt,
		}
	}
}
