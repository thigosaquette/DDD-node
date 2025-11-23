import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repository/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase // System Under Test

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('it not should be able to delete a question with another author.', async () => {
    const newQuestion = makeQuestion(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const wrongAuthorId = faker.string.uuid()

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: wrongAuthorId,
    })

    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {},
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID(faker.string.uuid()),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID(faker.string.uuid()),
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
    expect(result.isRight()).toBe(true)
  })
})
