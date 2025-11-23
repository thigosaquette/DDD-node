import { InMemoryAnswersRepository } from '@/test/repository/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repository/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase // System Under Test

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch paginated question answers', async () => {
    const question = makeQuestion()
    const anotherQuestion = makeQuestion()

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: question.id,
          createdAt: new Date(2024, 0, i),
        }),
      )
    }

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: anotherQuestion.id,
      }),
    )

    const result1 = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      itemsPerPage: 20,
    })
    const result2 = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
      itemsPerPage: 20,
    })

    if (result1.isRight() && result2.isRight()) {
      const { answers: page1 } = result1.value
      const { answers: page2 } = result2.value

      expect(page1).toHaveLength(20)
      expect(page2).toHaveLength(2)
    }
    expect(result1.isRight()).toBe(true)
    expect(result2.isRight()).toBe(true)
  })

  it('should be able to fetch question answers ordered by creation date', async () => {
    const question = makeQuestion()

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
        createdAt: new Date(2024, 0, 20),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
        createdAt: new Date(2024, 0, 18),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
        createdAt: new Date(2024, 0, 23),
      }),
    )

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      itemsPerPage: 3,
    })

    if (result.isRight()) {
      const { answers } = result.value

      expect(answers).toEqual([
        expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
      ])
    }
    expect(result.isRight()).toBe(true)
  })
})


