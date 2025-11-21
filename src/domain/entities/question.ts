import { Slug } from "../value-objects/slug"
import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/value-objects/unique-entity-id"
import { Optional } from "@/core/types/optional"
import dayjs from "dayjs"

interface QuestionRequiredProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID | undefined
  title: string
  slug: Slug
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionRequiredProps> {
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

  get createdAt() {
    return this.requiredProps.createdAt
  }

  get updatedAt() {
    return this.requiredProps.updatedAt
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

    this.requiredProps.content = this.content
    this.touch()
  }

  set title(title: string) {
    this.requiredProps.title = this.title
    this.requiredProps.slug = Slug.createFromText(title)
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    this.requiredProps.bestAnswerId = bestAnswerId
    this.touch()
  }
  

  private touch() {
    this.requiredProps.updatedAt = new Date()
  }

  static create(
    requiredProps: Optional<QuestionRequiredProps, 'slug' | 'createdAt'>, 
    id?: UniqueEntityID
  ) {
    const question = new Question({
      ...requiredProps,
      slug: requiredProps.slug ?? Slug.createFromText(requiredProps.title),
      createdAt: new Date()
    }, id)

    return question
  }
}