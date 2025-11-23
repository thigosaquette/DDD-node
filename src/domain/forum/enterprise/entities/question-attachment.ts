import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/value-objects/unique-entity-id"

export interface QuestionAttachmentRequiredProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentRequiredProps> {
  get questionId() {
    return this.requiredProps.questionId
  }
  
  get attachmentId() {
    return this.requiredProps.attachmentId
  }

  static create(requiredProps: QuestionAttachmentRequiredProps, id?: UniqueEntityID) {
    const questionAttachment = new QuestionAttachment(requiredProps, id)

    return questionAttachment
  }
}