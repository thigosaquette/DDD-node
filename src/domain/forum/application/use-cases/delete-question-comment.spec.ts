import { InMemoryQuestionCommentsRepository } from '@/test/repository/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase // System Under Test

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should not be able to delete a question comment with another author', async () => {
    const newQuestionComment = makeQuestionComment(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    const wrongAuthorId = faker.string.uuid()

    await expect(
      sut.execute({
        questionCommentId: newQuestionComment.id.toString(),
        authorId: wrongAuthorId,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: newQuestionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })
})

