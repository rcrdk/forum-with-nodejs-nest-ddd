import { Module } from '@nestjs/common'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'

@Module({
	providers: [
		PrismaService,
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		// PrismaQuestionCommentsRepository,
		// PrismaQuestionAttachmentsRepository,
		// PrismaAnswersRepository,
		// PrismaAnswerCommentsRepository,
		// PrismaAnswerAttachmentsRepository,
	],
	exports: [
		PrismaService,
		QuestionsRepository,
		// PrismaQuestionCommentsRepository,
		// PrismaQuestionAttachmentsRepository,
		// PrismaAnswersRepository,
		// PrismaAnswerCommentsRepository,
		// PrismaAnswerAttachmentsRepository,
	],
})
export class DatabaseModule {}
