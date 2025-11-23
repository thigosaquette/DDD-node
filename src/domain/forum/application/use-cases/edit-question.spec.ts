import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-answers-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase // System Under Test

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
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
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        title: 'Old title',
        content: 'Old content',
      },
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: 'New title',
      content: 'New content',
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
    }
    expect(result.isRight()).toBe(true)
  })
})

