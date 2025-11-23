import { makeQuestion } from "@/test/factories/make-question"
import { makeAnswer } from "@/test/factories/make-answer"
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen"
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

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)

    new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotificationUseCase)
  })

  it('should be able to send a notification when a best answer is chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    expect(question.domainEvents[0]?.getAggregateId().toString()).toBe(question.id.toString())
    expect(question.domainEvents[0]?.ocurredAt).toBeInstanceOf(Date)

    await inMemoryQuestionsRepository.save(question)

    expect(inMemoryNotificationsRepository.items).toHaveLength(1)

    const notification = inMemoryNotificationsRepository.items[0]

    expect(notification).toBeTruthy()
    expect(notification?.recipientId.toString()).toBe(answer.authorId.toString())
    expect(notification?.title).toContain('Sua resposta foi escolhida!')
  })
})

