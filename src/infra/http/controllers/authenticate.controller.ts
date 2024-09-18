import {
	Body,
	Controller,
	HttpCode,
	Post,
	UnauthorizedException,
	UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { z } from 'zod'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
	constructor(
		private jwt: JwtService,
		private prisma: PrismaService,
	) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {
		const { email, password } = body

		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!user) {
			throw new UnauthorizedException('Invalid user credentials')
		}

		const hasValidPassword = await compare(password, user.password)

		if (!hasValidPassword) {
			throw new UnauthorizedException('Invalid user credentials')
		}

		const accessToken = this.jwt.sign({
			sub: user.id,
		})

		return {
			access_token: accessToken,
		}
	}
}
