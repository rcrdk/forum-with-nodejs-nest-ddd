/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'

import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class QuestionCommentsRepository {
	abstract findById(id: string): Promise<QuestionComment | null>
	abstract findManyByQuestionId(id: string, params: PaginationParams): Promise<QuestionComment[]>
	abstract findManyByQuestionIdWithAuthor(id: string, params: PaginationParams): Promise<CommentWithAuthor[]>
	abstract create(questionComment: QuestionComment): Promise<void>
	abstract delete(questionComment: QuestionComment): Promise<void>
}
