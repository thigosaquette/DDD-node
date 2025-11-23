import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repository/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase // System Under Test

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'New question',
      content: 'New question content',
      attachmentsIds: ['1', '2'],
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      id: question.id,
      authorId: question.authorId,
      title: question.title,
      content: question.content,
      attachments: question.attachments,
    })
    expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toEqual(expect.arrayContaining([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('2'),
      }),
    ]))
    expect(question.id).toBeTruthy()
  })
})
