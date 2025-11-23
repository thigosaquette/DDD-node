import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-questions-repository'
import { InMemoryAnswersRepository } from '@/test/repository/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repository/in-memory-question-attachments-repository'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repository/in-memory-answer-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: ChooseQuestionBestAnswerUseCase // System Under Test

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should not be able to choose best answer with another author', async () => {
    const question = makeQuestion(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    const answer = makeAnswer(
      {
        questionId: question.id,
      },
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    const wrongAuthorId = faker.string.uuid()

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: wrongAuthorId,
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should not be able to choose best answer from another question', async () => {
    const question1 = makeQuestion(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    const question2 = makeQuestion(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    const answerFromQuestion2 = makeAnswer(
      {
        questionId: question2.id,
      },
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionsRepository.create(question1)
    await inMemoryQuestionsRepository.create(question2)
    await inMemoryAnswersRepository.create(answerFromQuestion2)

    const result = await sut.execute({
      answerId: answerFromQuestion2.id.toString(),
      authorId: question1.authorId.toString(),
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should be able to choose best answer', async () => {
    const question = makeQuestion(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    const answer = makeAnswer(
      {
        questionId: question.id,
      },
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
        bestAnswerId: answer.id,
      })
      expect(result.value.question.bestAnswerId).toEqual(answer.id)
    }
    expect(result.isRight()).toBe(true)
  })
})

