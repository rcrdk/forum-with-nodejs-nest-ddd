import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	Patch,
} from '@nestjs/common'

import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
	constructor(
		private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
	) {}

	@Patch()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('answerId') answerId: string,
	) {
		const { sub: authorId } = user

		const result = await this.chooseQuestionBestAnswer.execute({
			answerId,
			authorId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
