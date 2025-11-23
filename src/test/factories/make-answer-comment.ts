import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentRequiredProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerComment(
  override: Partial<AnswerCommentRequiredProps> = {},
  id?: UniqueEntityID,
): AnswerComment {
  return AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}

