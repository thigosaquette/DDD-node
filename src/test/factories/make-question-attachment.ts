import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentRequiredProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentRequiredProps> = {},
  id?: UniqueEntityID,
): QuestionAttachment {
  return QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}

