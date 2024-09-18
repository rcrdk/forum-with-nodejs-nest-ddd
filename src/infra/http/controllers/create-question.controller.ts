import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema,
		@CurrentUser() user: UserPayload,
	) {
		const { title, content } = body
		const { sub: authorId } = user

		const result = await this.createQuestion.execute({
			title,
			content,
			authorId,
			attachmentsIds: [],
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
