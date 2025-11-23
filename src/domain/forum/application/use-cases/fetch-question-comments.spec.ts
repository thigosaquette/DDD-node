import { InMemoryQuestionCommentsRepository } from '@/test/repository/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { makeQuestion } from '@/test/factories/make-question'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase // System Under Test

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch paginated question comments', async () => {
    const question = makeQuestion()
    const anotherQuestion = makeQuestion()

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: question.id,
          createdAt: new Date(2024, 0, i),
        }),
      )
    }

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
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
      const { questionComments: page1 } = result1.value
      const { questionComments: page2 } = result2.value

      expect(page1).toHaveLength(20)
      expect(page2).toHaveLength(2)
    }
    expect(result1.isRight()).toBe(true)
    expect(result2.isRight()).toBe(true)
  })

  it('should be able to fetch question comments ordered by creation date', async () => {
    const question = makeQuestion()

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
        createdAt: new Date(2024, 0, 20),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
        createdAt: new Date(2024, 0, 18),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
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
      const { questionComments } = result.value

      expect(questionComments).toEqual([
        expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
      ])
    }
    expect(result.isRight()).toBe(true)
  })
})

