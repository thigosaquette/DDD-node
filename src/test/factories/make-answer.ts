import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import {
  Answer,
  AnswerRequiredProps,
} from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(
  override: Partial<AnswerRequiredProps> = {},
  id?: UniqueEntityID,
): Answer {
  return Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}


