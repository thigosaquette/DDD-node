import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { AnswerAttachmentList } from './answer-attachment-list'

export interface AnswerRequiredProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
  attachments: AnswerAttachmentList
}

export class Answer extends Entity<AnswerRequiredProps> {
  get authorId() {
    return this.requiredProps.authorId
  }

  get questionId() {
    return this.requiredProps.questionId
  }

  get content() {
    return this.requiredProps.content
  }

  get createdAt() {
    return this.requiredProps.createdAt
  }

  get updatedAt() {
    return this.requiredProps.updatedAt
  }

  get attachments() {
    return this.requiredProps.attachments
  }

  get excerpt() {
    return this.requiredProps.content.substring(0, 120).trim().concat('...')
  }

  set content(content: string) {
    if (content.length > 2400) {
      throw new Error('Invalid content length.')
    }

    this.requiredProps.content = content
    this.touch()
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.requiredProps.attachments = attachments
    this.touch()
  }

  private touch() {
    this.requiredProps.updatedAt = new Date()
  }

  static create(
    requiredProps: Optional<AnswerRequiredProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...requiredProps,
        attachments: requiredProps.attachments ?? new AnswerAttachmentList(),
        createdAt: requiredProps.createdAt ?? new Date(),
      },
      id,
    )

    return answer
  }
}
