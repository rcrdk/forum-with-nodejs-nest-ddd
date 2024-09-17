import { Controller, Get, Post } from '@nestjs/common'

import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

@Controller('/api')
export class AppController {
	constructor(
		private appService: AppService,
		private prisma: PrismaService,
	) {}

	@Get('/hello')
	async getHello(): Promise<any> {
		return await this.prisma.user.findMany()
	}

	@Post('/hello')
	setHello(): string {
		return 'Oi!'
	}
}
