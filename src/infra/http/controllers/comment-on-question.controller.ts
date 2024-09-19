import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const commentOnQuestionBodySchema = z.object({
	content: z.string(),
})

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
	constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('questionId') questionId: string,
	) {
		const { content } = body
		const { sub: authorId } = user

		const result = await this.commentOnQuestion.execute({
			content,
			authorId,
			questionId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
