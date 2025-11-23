import { InMemoryAnswersRepository } from '@/test/repository/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repository/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase // System Under Test

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'New answer content',
      attachmentsIds: ['1', '2'],
    })

    if (result.isRight()) {
      const { answer } = result.value

      expect(inMemoryAnswersRepository.items[0]).toMatchObject({
        id: answer.id,
        authorId: answer.authorId,
        questionId: answer.questionId,
        content: answer.content,
        attachments: answer.attachments,
      })
      expect(inMemoryAnswersRepository.items[0]?.attachments.currentItems).toEqual(expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ]))
      expect(answer.id).toBeTruthy()
    }
    expect(result.isRight()).toBe(true)
  })
})
