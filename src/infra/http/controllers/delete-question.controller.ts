import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from '@nestjs/common'

import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/questions/:id')
export class DeleteQuestionController {
	constructor(private deleteQuestion: DeleteQuestionUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('id') questionId: string,
	) {
		const { sub: authorId } = user

		const result = await this.deleteQuestion.execute({
			authorId,
			questionId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
