import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionRequiredProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID | undefined
  title: string
  slug: Slug
  content: string
  updatedAt?: Date
  createdAt: Date
  attachments: QuestionAttachmentList
}

export class Question extends AggregateRoot<QuestionRequiredProps> {
  get authorId() {
    return this.requiredProps.authorId
  }

  get bestAnswerId() {
    return this.requiredProps.bestAnswerId
  }
  
  get title() {
    return this.requiredProps.title
  }
  
  get slug() {
    return this.requiredProps.slug
  }
  
  get content() {
    return this.requiredProps.content
  }
  
  get updatedAt() {
    return this.requiredProps.updatedAt
  }

  get createdAt() {
    return this.requiredProps.createdAt
  }
  
  get attachments() {
    return this.requiredProps.attachments
  }
  
  get isNew(): boolean {
    return dayjs().diff(this.requiredProps.createdAt, 'days') <= 3
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

  set title(title: string) {
    this.requiredProps.title = title
    this.requiredProps.slug = Slug.createFromText(title)
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (bestAnswerId === undefined) {
      return
    }

    if (this.requiredProps.bestAnswerId === undefined || !this.requiredProps.bestAnswerId.equals(bestAnswerId)) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.requiredProps.bestAnswerId = bestAnswerId

    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.requiredProps.attachments = attachments
    this.touch()
  }

  private touch() {
    this.requiredProps.updatedAt = new Date()
  }

  static create(
    requiredProps: Optional<QuestionRequiredProps, 'slug' | 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...requiredProps,
        slug: requiredProps.slug ?? Slug.createFromText(requiredProps.title),
        attachments: requiredProps.attachments ?? new QuestionAttachmentList(),
        createdAt: requiredProps.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
