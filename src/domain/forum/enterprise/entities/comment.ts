import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'

export interface CommentRequiredProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

export abstract class Comment<
  RequiredProps extends CommentRequiredProps,
> extends Entity<RequiredProps> {
  get authorId() {
    return this.requiredProps.authorId
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

  set content(content: string) {
    if (content.length > 2400) {
      throw new Error('Invalid content length.')
    }

    this.requiredProps.content = content
    this.touch()
  }

  protected touch() {
    this.requiredProps.updatedAt = new Date()
  }
}
