import { makeAnswer } from "@/test/factories/make-answer"
import { OnAnswerCreated } from "./on-answer-created"
import { InMemoryAnswersRepository } from "@/test/repository/in-memory-answers-repository"
import { InMemoryAnswerAttachmentsRepository } from "@/test/repository/in-memory-answer-attachments-repository"
import { InMemoryQuestionsRepository } from "@/test/repository/in-memory-questions-repository"
import { InMemoryQuestionAttachmentsRepository } from "@/test/repository/in-memory-question-attachments-repository"
import { SendNotificationUseCase } from "../use-cases/send-notification"
import { InMemoryNotificationsRepository } from "@/test/repository/in-memory-notifications-repository"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

describe('On Answer Created', () => {
beforeEach(() => {
  inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
  inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
  inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
  sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
  inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
  inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)

  new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
})

  it('should be able to send a new answer notification when an answer is created', async () => {
    const answer = makeAnswer()

    expect(answer.domainEvents[0]?.getAggregateId().toString()).toBe(answer.id.toString())
    expect(answer.domainEvents[0]?.ocurredAt).toBeInstanceOf(Date)
    
    await inMemoryAnswersRepository.create(answer)

    expect(inMemoryAnswersRepository.items).toHaveLength(1)
    expect(inMemoryAnswersRepository.items[0]?.domainEvents).toHaveLength(0)
  })
})