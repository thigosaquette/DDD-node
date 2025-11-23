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

    const { questionComments: page1 } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      itemsPerPage: 20,
    })
    const { questionComments: page2 } = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
      itemsPerPage: 20,
    })

    expect(page1).toHaveLength(20)
    expect(page2).toHaveLength(2)
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

    const { questionComments } = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
      itemsPerPage: 3,
    })

    expect(questionComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
    ])
  })
})

