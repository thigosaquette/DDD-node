import { InMemoryQuestionCommentsRepository } from '@/test/repository/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase // System Under Test

describe('Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to comment on question', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'New comment content',
    })

    if (result.isRight()) {
      const { questionComment } = result.value

      expect(inMemoryQuestionCommentsRepository.items[0]).toMatchObject({
        id: questionComment.id,
        authorId: questionComment.authorId,
        questionId: questionComment.questionId,
        content: questionComment.content,
      })
      expect(questionComment.id).toBeTruthy()
    }
    expect(result.isRight()).toBe(true)
  })
})

