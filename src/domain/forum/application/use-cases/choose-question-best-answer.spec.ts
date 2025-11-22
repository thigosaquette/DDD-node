import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-answers-repository'
import { InMemoryAnswersRepository } from '@/test/repository/in-memory-questions-repository copy'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase // System Under Test

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
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

    await expect(
      sut.execute({
        answerId: answer.id.toString(),
        authorId: wrongAuthorId,
      }),
    ).rejects.toBeInstanceOf(Error)
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

    await expect(
      sut.execute({
        answerId: answerFromQuestion2.id.toString(),
        authorId: question1.authorId.toString(),
      }),
    ).rejects.toBeInstanceOf(Error)
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

    const { question: updatedQuestion } = await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      bestAnswerId: answer.id,
    })
    expect(updatedQuestion.bestAnswerId).toEqual(answer.id)
  })
})

