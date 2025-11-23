import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-answers-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase // System Under Test

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'New question',
      content: 'New question content',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      id: question.id,
      authorId: question.authorId,
      title: question.title,
      content: question.content,
    })
    expect(question.id).toBeTruthy()
  })
})
