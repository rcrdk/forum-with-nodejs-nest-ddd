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

import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { CommentWithAuthorPresenter } from '../presenters/comment-with-author.presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))
const perPageQueryParamSchema = z.string().optional().default('20').transform(Number).pipe(z.number().min(1))

const pageQueryParamValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
const perPageQueryParamValidationPipe = new ZodValidationPipe(perPageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type PerPageQueryParamSchema = z.infer<typeof perPageQueryParamSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
	constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(
		@Query('page', pageQueryParamValidationPipe) page: PageQueryParamSchema,
		@Query('perPage', perPageQueryParamValidationPipe) perPage: PerPageQueryParamSchema,
		@Param('questionId') questionId: string,
	) {
		const result = await this.fetchQuestionComments.execute({
			page,
			perPage,
			questionId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const comments = result.value.comments

		return {
			comments: comments.map((comment) =>
				CommentWithAuthorPresenter.toHttp(comment),
			),
		}
	}
}
