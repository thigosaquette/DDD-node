import { InMemoryAnswerCommentsRepository } from '@/test/repository/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase // System Under Test

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should not be able to delete a answer comment with another author', async () => {
    const newAnswerComment = makeAnswerComment(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    const wrongAuthorId = faker.string.uuid()

    const result = await sut.execute({
      answerCommentId: newAnswerComment.id.toString(),
      authorId: wrongAuthorId,
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswerComment = makeAnswerComment(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryAnswerCommentsRepository.create(newAnswerComment)

    const result = await sut.execute({
      answerCommentId: newAnswerComment.id.toString(),
      authorId: newAnswerComment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
    expect(result.isRight()).toBe(true)
  })
})

