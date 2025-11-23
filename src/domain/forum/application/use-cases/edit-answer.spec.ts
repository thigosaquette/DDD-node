import { InMemoryAnswersRepository } from '@/test/repository/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repository/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase // System Under Test

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository)
  })

  it('should not be able to edit a answer with another author', async () => {
    const newAnswer = makeAnswer(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const wrongAuthorId = faker.string.uuid()

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: wrongAuthorId,
      content: 'New content',
      attachmentsIds: [],
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should be able to edit a answer', async () => {
    const attachmentId1 = new UniqueEntityID(faker.string.uuid())
    const attachmentId2 = new UniqueEntityID(faker.string.uuid())
    const attachmentId3 = new UniqueEntityID(faker.string.uuid())

    const newAnswer = makeAnswer(
      {
        content: 'Old content',
      },
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: attachmentId1,
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: attachmentId2,
      }),
    )

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'New content',
      attachmentsIds: [attachmentId1.toString(), attachmentId3.toString()],
    })

    if (result.isRight()) {
      expect(inMemoryAnswersRepository.items[0]).toMatchObject({
        content: 'New content',
      })
      expect(result.value.answer).toMatchObject({
        content: 'New content',
      })

      expect(inMemoryAnswersRepository.items[0]?.attachments.currentItems).toEqual(expect.arrayContaining([
        expect.objectContaining({
          attachmentId: attachmentId1,
        }),
        expect.objectContaining({
          attachmentId: attachmentId3,
        }),
      ]))

      expect(inMemoryAnswersRepository.items[0]?.attachments.getNewItems()).toContainEqual(expect.objectContaining({
        attachmentId: attachmentId3,
      }))

      expect(inMemoryAnswersRepository.items[0]?.attachments.getRemovedItems()).toContainEqual(expect.objectContaining({
        attachmentId: attachmentId2,
      }))
    }
    expect(result.isRight()).toBe(true)
  })
})

