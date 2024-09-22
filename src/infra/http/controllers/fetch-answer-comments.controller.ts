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

import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { CommentWithAuthorPresenter } from '../presenters/comment-with-author.presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))
const perPageQueryParamSchema = z.string().optional().default('20').transform(Number).pipe(z.number().min(1))

const pageQueryParamValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
const perPageQueryParamValidationPipe = new ZodValidationPipe(perPageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type PerPageQueryParamSchema = z.infer<typeof perPageQueryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
	constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(
		@Query('page', pageQueryParamValidationPipe) page: PageQueryParamSchema,
		@Query('perPage', perPageQueryParamValidationPipe) perPage: PerPageQueryParamSchema,
		@Param('answerId') answerId: string,
	) {
		const result = await this.fetchAnswerComments.execute({
			page,
			perPage,
			answerId,
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
