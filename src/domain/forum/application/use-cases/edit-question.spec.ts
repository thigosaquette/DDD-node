import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repository/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase // System Under Test

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository)
  })

  it('should not be able to edit a question with another author', async () => {
    const newQuestion = makeQuestion(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const wrongAuthorId = faker.string.uuid()

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: wrongAuthorId,
      title: 'New title',
      content: 'New content',
      attachmentsIds: [],
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should be able to edit a question', async () => {
    const attachmentId1 = new UniqueEntityID(faker.string.uuid())
    const attachmentId2 = new UniqueEntityID(faker.string.uuid())
    const attachmentId3 = new UniqueEntityID(faker.string.uuid())

    const newQuestion = makeQuestion(
      {
        title: 'Old title',
        content: 'Old content',
      },
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: attachmentId1,
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: attachmentId2,
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: 'New title',
      content: 'New content',
      attachmentsIds: [attachmentId1.toString(), attachmentId3.toString()],
    })

    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
        title: 'New title',
        content: 'New content',
      })

      expect(result.value.question).toMatchObject({
        title: 'New title',
        content: 'New content',
      })

      expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toEqual(expect.arrayContaining([
        expect.objectContaining({
          attachmentId: attachmentId1,
        }),
        expect.objectContaining({
          attachmentId: attachmentId3,
        }),
      ]))

      expect(inMemoryQuestionsRepository.items[0]?.attachments.getNewItems()).toContainEqual(expect.objectContaining({
        attachmentId: attachmentId3,
      }))

      expect(inMemoryQuestionsRepository.items[0]?.attachments.getRemovedItems()).toContainEqual(expect.objectContaining({
        attachmentId: attachmentId2,
      }))
    }

    expect(result.isRight()).toBe(true)
  })
})

