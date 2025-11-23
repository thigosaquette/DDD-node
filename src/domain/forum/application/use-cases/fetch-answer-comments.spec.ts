import { InMemoryAnswerCommentsRepository } from '@/test/repository/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { makeAnswer } from '@/test/factories/make-answer'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase // System Under Test

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answer = makeAnswer()
    const anotherAnswer = makeAnswer()

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: answer.id,
          createdAt: new Date(2024, 0, i),
        }),
      )
    }

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: anotherAnswer.id,
      }),
    )

    const { answerComments: page1 } = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
      itemsPerPage: 20,
    })
    const { answerComments: page2 } = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
      itemsPerPage: 20,
    })

    expect(page1).toHaveLength(20)
    expect(page2).toHaveLength(2)
  })

  it('should be able to fetch answer comments ordered by creation date', async () => {
    const answer = makeAnswer()

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        createdAt: new Date(2024, 0, 20),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        createdAt: new Date(2024, 0, 18),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        createdAt: new Date(2024, 0, 23),
      }),
    )

    const { answerComments } = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
      itemsPerPage: 3,
    })

    expect(answerComments).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
    ])
  })
})

