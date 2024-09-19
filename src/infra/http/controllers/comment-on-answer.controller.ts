import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const commentOnAnswerBodySchema = z.object({
	content: z.string(),
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
	constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('answerId') answerId: string,
	) {
		const { content } = body
		const { sub: authorId } = user

		const result = await this.commentOnAnswer.execute({
			content,
			authorId,
			answerId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
