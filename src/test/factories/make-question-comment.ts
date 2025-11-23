import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentRequiredProps,
} from '@/domain/forum/enterprise/entities/question-comment'

export function makeQuestionComment(
  override: Partial<QuestionCommentRequiredProps> = {},
  id?: UniqueEntityID,
): QuestionComment {
  return QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}

