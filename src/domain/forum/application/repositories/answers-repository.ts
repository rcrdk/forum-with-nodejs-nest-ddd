import { PaginationParams } from '@/core/repositories/pagination-params'

import { Answer } from '../../enterprise/entities/answer'

export abstract class AnswersRepository {
	abstract findById(id: string): Promise<Answer | null>
	abstract findManyByQuestionId(
		id: string,
		params: PaginationParams,
	): Promise<Answer[]>

	abstract create(answer: Answer): Promise<void>
	abstract save(question: Answer): Promise<void>
	abstract delete(question: Answer): Promise<void>
}
