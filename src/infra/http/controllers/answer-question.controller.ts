import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Post,
} from '@nestjs/common'
import { z } from 'zod'

import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const answerQuestionBodySchema = z.object({
	content: z.string(),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
	constructor(private answerQuestion: AnswerQuestionUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('questionId') questionId: string,
	) {
		const { content } = body
		const { sub: authorId } = user

		const result = await this.answerQuestion.execute({
			content,
			attachmentsIds: [],
			authorId,
			questionId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
