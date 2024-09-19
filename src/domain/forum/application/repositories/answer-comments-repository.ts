/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'

import { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswerCommentsRepository {
	abstract findById(id: string): Promise<AnswerComment | null>
	abstract findManyByAnswerId(id: string, params: PaginationParams): Promise<AnswerComment[]>
	abstract create(answerComment: AnswerComment): Promise<void>
	abstract delete(answerComment: AnswerComment): Promise<void>
}
