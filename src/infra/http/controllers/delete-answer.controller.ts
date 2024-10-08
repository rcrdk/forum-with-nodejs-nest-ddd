import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from '@nestjs/common'

import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/answers/:id')
export class DeleteAnswerController {
	constructor(private deleteAnswer: DeleteAnswerUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('id') answerId: string,
	) {
		const { sub: authorId } = user

		const result = await this.deleteAnswer.execute({
			answerId,
			authorId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
