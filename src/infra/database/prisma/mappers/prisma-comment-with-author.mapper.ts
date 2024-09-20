import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

type PrismaCommentWithAuthor = PrismaComment & {
	author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
	static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
		return CommentWithAuthor.create({
			commentId: new UniqueEntityId(raw.id),
			content: raw.content,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
			authorId: new UniqueEntityId(raw.authorId),
			author: raw.author.name,
		})
	}
}
