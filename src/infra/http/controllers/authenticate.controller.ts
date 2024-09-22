import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
	UnauthorizedException,
	UsePipes,
} from '@nestjs/common'
import { Response } from 'express'
import { z } from 'zod'

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { InvalidCredentialsError } from '@/domain/forum/application/use-cases/errors/invalid-credentials-error'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
	constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(
		@Body() body: AuthenticateBodySchema,
		@Res({ passthrough: true }) res: Response,
	) {
		const { email, password } = body

		const result = await this.authenticateStudent.execute({
			email,
			password,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case InvalidCredentialsError:
					throw new UnauthorizedException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		const { accessToken } = result.value

		res
			.cookie('Authentication', accessToken, {
				httpOnly: true,
				secure: true,
				signed: true,
			})
			.send({
				access_token: accessToken,
			})
	}
}
