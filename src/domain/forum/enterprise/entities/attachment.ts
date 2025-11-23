import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/value-objects/unique-entity-id"

interface AttachmentRequiredProps {
  title: string
  link: string
}

export class Attachment extends Entity<AttachmentRequiredProps> {
  get title() {
    return this.requiredProps.title
  }

  get link() {
    return this.requiredProps.link
  }

  static create(requiredProps: AttachmentRequiredProps, id?: UniqueEntityID) {
    const attachment = new Attachment(requiredProps, id)

    return attachment
  }
}