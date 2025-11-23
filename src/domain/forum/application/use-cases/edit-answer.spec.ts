import { InMemoryAnswersRepository } from '@/test/repository/in-memory-questions-repository copy'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from '@/test/factories/make-answer'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { faker } from '@faker-js/faker'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase // System Under Test

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
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
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(result.isLeft()).toBe(true)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        content: 'Old content',
      },
      new UniqueEntityID(faker.string.uuid()),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'New content',
    })

    if (result.isRight()) {
      expect(inMemoryAnswersRepository.items[0]).toMatchObject({
        content: 'New content',
      })
      expect(result.value.answer).toMatchObject({
        content: 'New content',
      })
    }
    expect(result.isRight()).toBe(true)
  })
})

