import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { AnswerWithAuthor } from '../../enterprise/entities/value-objects/answer-with-author'
import { AnswersRepository } from '../repositories/answers.repository'

interface FetchQuestionAnswersUseCaseRequest {
	questionId: string
	page: number
	perPage: number
}

type FetchQuestionAnswersUseCaseResponse = Either<
	null,
	{
		answers: AnswerWithAuthor[]
	}
>

@Injectable()
export class FetchQuestionAnswersUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		questionId,
		page,
		perPage,
	}: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionIdWithAuthor(
			questionId,
			{
				page,
				perPage,
			},
		)

		return right({ answers })
	}
}
