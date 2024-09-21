import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachementsRepository implements AttachmentsRepository {
	public items: Attachment[] = []

	async create(attachment: Attachment) {
		this.items.push(attachment)
	}
}
