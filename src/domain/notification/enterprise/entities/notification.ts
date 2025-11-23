import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface NotificationRequiredProps {
  recipientId: UniqueEntityID
  title: string
  content: string
  readAt?: Date | undefined
  createdAt: Date
}

export class Notification extends Entity<NotificationRequiredProps> {
  constructor(requiredProps: NotificationRequiredProps, id?: UniqueEntityID) {
    super(requiredProps, id)
  }

  get recipientId() {
    return this.requiredProps.recipientId
  }

  get title() {
    return this.requiredProps.title
  }

  get content() {
    return this.requiredProps.content
  }

  get readAt() {
    return this.requiredProps.readAt
  }

  get createdAt() {
    return this.requiredProps.createdAt
  }

  read() {
    this.requiredProps.readAt = new Date()
  }

  static create(
    requiredProps: Optional<NotificationRequiredProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const notification = new Notification({
      ...requiredProps,
      createdAt: requiredProps.createdAt ?? new Date(),
    }, id)

    return notification
  }
}