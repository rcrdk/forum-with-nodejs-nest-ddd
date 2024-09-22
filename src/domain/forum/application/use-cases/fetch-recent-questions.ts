import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions.repository'

interface FetchRecentQuestionsUseCaseRequest {
	page: number
	perPage: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
	null,
	{
		questions: Question[]
	}
>

@Injectable()
export class FetchRecentQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		page,
		perPage,
	}: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.findManyRecent({
			page,
			perPage,
		})

		return right({ questions })
	}
}
