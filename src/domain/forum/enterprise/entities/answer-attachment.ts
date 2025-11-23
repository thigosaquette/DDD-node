import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/value-objects/unique-entity-id"

export interface AnswerAttachmentRequiredProps {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentRequiredProps> {
  get answerId() {
    return this.requiredProps.answerId
  }
  
  get attachmentId() {
    return this.requiredProps.attachmentId
  }

  static create(requiredProps: AnswerAttachmentRequiredProps, id?: UniqueEntityID) {
    const answerAttachment = new AnswerAttachment(requiredProps, id)

    return answerAttachment
  }
}