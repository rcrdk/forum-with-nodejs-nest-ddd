import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { PrismaService } from '@/prisma/prisma.service'

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
	constructor(private prisma: PrismaService) {}

	@Get()
	@HttpCode(200)
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
		const MAX_ITEMS_BY_PAGE = 2
		const CURRENT_PAGE_START_ON = (page - 1) * MAX_ITEMS_BY_PAGE

		const questions = await this.prisma.question.findMany({
			take: MAX_ITEMS_BY_PAGE,
			skip: CURRENT_PAGE_START_ON,
			orderBy: {
				createdAt: 'desc',
			},
		})

		const countQuestions = await this.prisma.question.count()

		return {
			questions,
			pagination: {
				total: countQuestions,
				perPage: MAX_ITEMS_BY_PAGE,
				currentPage: page,
				lastPage: Math.ceil(countQuestions / MAX_ITEMS_BY_PAGE),
			},
		}
	}
}
