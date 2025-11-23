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
    const { answerComment } = await sut.execute({
      authorId: '1',
      answerId: '1',
      content: 'New comment content',
    })

    expect(inMemoryAnswerCommentsRepository.items[0]).toMatchObject({
      id: answerComment.id,
      authorId: answerComment.authorId,
      answerId: answerComment.answerId,
      content: answerComment.content,
    })
    expect(answerComment.id).toBeTruthy()
  })
})

