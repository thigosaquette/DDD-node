import { Entity } from "@/core/entities/entity"
import { Optional } from "@/core/types/optional"
import { UniqueEntityID } from "@/core/value-objects/unique-entity-id"

interface AnswerRequiredProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
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

  get excerpt() {
    return this.requiredProps.content.substring(0, 120).trim().concat('...')
  }

  set content(content: string) {
    if (content.length > 2400) {
      throw new Error('Invalid content length.')
    }

    this.requiredProps.content = this.content
    this.touch()
  }

  private touch() {
    this.requiredProps.updatedAt = new Date()
  }

  static create(
    requiredProps: Optional<AnswerRequiredProps, 'createdAt'>, 
    id?: UniqueEntityID
  ) {
    const answer = new Answer({
      ...requiredProps,
      createdAt: new Date(),
    }, id)

    return answer
  }
}