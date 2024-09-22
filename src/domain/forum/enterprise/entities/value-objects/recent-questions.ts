import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Slug } from './slug'

export interface RecentQuestionProps {
	questionId: UniqueEntityId
	authorId: UniqueEntityId
	author: string
	title: string
	slug: Slug
	createdAt: Date
	updatedAt?: Date | null
}

export class RecentQuestions extends ValueObject<RecentQuestionProps> {
	get questionId() {
		return this.props.questionId
	}

	get authorId() {
		return this.props.authorId
	}

	get author() {
		return this.props.author
	}

	get title() {
		return this.props.title
	}

	get slug() {
		return this.props.slug
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	static create(props: RecentQuestionProps) {
		return new RecentQuestions(props)
	}
}
