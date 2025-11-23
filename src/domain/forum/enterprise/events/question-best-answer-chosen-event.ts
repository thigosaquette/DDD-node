import { DomainEvent } from "@/core/events/domain-event"
import { Question } from "../entities/question"
import { UniqueEntityID } from "@/core/value-objects/unique-entity-id"

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question
    this.bestAnswerId = bestAnswerId
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}