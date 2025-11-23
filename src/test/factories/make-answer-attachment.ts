import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentRequiredProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentRequiredProps> = {},
  id?: UniqueEntityID,
): AnswerAttachment {
  return AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}

