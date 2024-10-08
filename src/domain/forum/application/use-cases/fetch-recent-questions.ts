import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { RecentQuestions } from '../../enterprise/entities/value-objects/recent-questions'
import { QuestionsRepository } from '../repositories/questions.repository'

interface FetchRecentQuestionsUseCaseRequest {
	page: number
	perPage: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
	null,
	{
		questions: RecentQuestions[]
	}
>

@Injectable()
export class FetchRecentQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		page,
		perPage,
	}: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.findManyRecentWithAuthor({
			page,
			perPage,
		})

		return right({ questions })
	}
}
