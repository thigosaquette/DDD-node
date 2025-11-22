import { InMemoryAnswersRepository } from '@/test/repository/in-memory-questions-repository copy'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeQuestion } from '@/test/factories/make-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase // System Under Test

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
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

    const { answers: page1 } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      itemsPerPage: 20,
    })
    const { answers: page2 } = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
      itemsPerPage: 20,
    })

    expect(page1).toHaveLength(20)
    expect(page2).toHaveLength(2)
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

    const { answers } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      itemsPerPage: 3,
    })

    expect(answers).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
    ])
  })
})

