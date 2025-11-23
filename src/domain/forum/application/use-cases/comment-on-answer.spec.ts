import { InMemoryAnswerCommentsRepository } from '@/test/repository/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase // System Under Test

describe('Comment On Answer', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to comment on answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      answerId: '1',
      content: 'New comment content',
    })

    if (result.isRight()) {
      const { answerComment } = result.value

      expect(inMemoryAnswerCommentsRepository.items[0]).toMatchObject({
        id: answerComment.id,
        authorId: answerComment.authorId,
        answerId: answerComment.answerId,
        content: answerComment.content,
      })
      expect(answerComment.id).toBeTruthy()
    }
    expect(result.isRight()).toBe(true)
  })
})

