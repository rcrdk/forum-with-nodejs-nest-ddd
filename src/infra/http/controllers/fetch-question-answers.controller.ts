/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Param,
	Query,
} from '@nestjs/common'
import { z } from 'zod'

import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { AnswerPresenter } from '../presenters/answer.presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))
const perPageQueryParamSchema = z.string().optional().default('20').transform(Number).pipe(z.number().min(1))

const pageQueryParamValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
const perPageQueryParamValidationPipe = new ZodValidationPipe(perPageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type PerPageQueryParamSchema = z.infer<typeof perPageQueryParamSchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
	constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(
		@Query('page', pageQueryParamValidationPipe) page: PageQueryParamSchema,
		@Query('perPage', perPageQueryParamValidationPipe) perPage: PerPageQueryParamSchema,
		@Param('questionId') questionId: string,
	) {
		const result = await this.fetchQuestionAnswers.execute({
			page,
			perPage,
			questionId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const { answers } = result.value

		return {
			answers: answers.map((answer) => AnswerPresenter.toHttp(answer)),
		}
	}
}
