import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import {
  Question,
  QuestionRequiredProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(
  override: Partial<QuestionRequiredProps> = {},
  id?: UniqueEntityID,
): Question {
  return Question.create(
    {
      title: faker.lorem.sentence(),
      slug: Slug.InsertASlug('example-question'),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
