import {
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Post,
	UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
	constructor(private prisma: PrismaService) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBodySchema) {
		const { name, email, password } = body
	}
}
