/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'

import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'
import { RecentQuestions } from '../../enterprise/entities/value-objects/recent-questions'

export abstract class QuestionsRepository {
	abstract findById(id: string): Promise<Question | null>
	abstract findBySlug(slug: string): Promise<Question | null>
	abstract findBySlugWithDetails(slug: string): Promise<QuestionDetails | null>
	abstract findManyRecent(params: PaginationParams): Promise<Question[]>
	abstract findManyRecentWithAuthor(params: PaginationParams): Promise<RecentQuestions[]>
	abstract create(question: Question): Promise<void>
	abstract save(question: Question): Promise<void>
	abstract delete(question: Question): Promise<void>
}
