import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
	UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { QuestionPresenter } from '../presenters/question.presenter'

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
	constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
		const result = await this.fetchRecentQuestions.execute({
			page,
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

		// return {
		// 	questions,
		// 	pagination: {
		// 		total: countQuestions,
		// 		perPage: MAX_ITEMS_BY_PAGE,
		// 		currentPage: page,
		// 		lastPage: Math.ceil(countQuestions / MAX_ITEMS_BY_PAGE),
		// 	},
		// }
	}
}
