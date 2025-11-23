import { InMemoryAnswersRepository } from '@/test/repository/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repository/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase // System Under Test

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('it not should be able to delete a answer with another author.', async () => {
    const newAnswer = makeAnswer(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const wrongAuthorId = faker.string.uuid()

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: wrongAuthorId,
    })

    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID(faker.string.uuid()),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID(faker.string.uuid()),
      }),
    )

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
    expect(result.isRight()).toBe(true)
  })
})

