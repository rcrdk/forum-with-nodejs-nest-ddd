import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachemntsRepository {
	abstract create(attachment: Attachment): Promise<void>
}
