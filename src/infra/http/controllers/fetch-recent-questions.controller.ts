/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common'
import { z } from 'zod'

import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { QuestionPresenter } from '../presenters/question.presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))
const perPageQueryParamSchema = z.string().optional().default('20').transform(Number).pipe(z.number().min(1))

const pageQueryParamValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
const perPageQueryParamValidationPipe = new ZodValidationPipe(perPageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type PerPageQueryParamSchema = z.infer<typeof perPageQueryParamSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
	constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(
		@Query('page', pageQueryParamValidationPipe) page: PageQueryParamSchema,
		@Query('perPage', perPageQueryParamValidationPipe) perPage: PerPageQueryParamSchema,
	) {
		const result = await this.fetchRecentQuestions.execute({
			page,
			perPage,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const { questions } = result.value

		return {
			questions: questions.map((question) =>
				QuestionPresenter.toHttp(question),
			),
		}
	}
}
