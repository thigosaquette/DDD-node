import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repository/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase // System Under Test

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(
        makeQuestion({ createdAt: new Date(2024, 0, i) }),
      )
    }

    const result1 = await sut.execute({ page: 1, itemsPerPage: 20 })
    const result2 = await sut.execute({ page: 2, itemsPerPage: 20 })

    if (result1.isRight() && result2.isRight()) {
      const { questions: page1 } = result1.value
      const { questions: page2 } = result2.value

      expect(page1).toHaveLength(20)
      expect(page2).toHaveLength(2)
    }
    expect(result1.isRight()).toBe(true)
    expect(result2.isRight()).toBe(true)
  })

  it('should be able to fetch recent questions ordered by creation date', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 18) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 23) }),
    )

    const result = await sut.execute({ page: 1, itemsPerPage: 3 })

    if (result.isRight()) {
      const { questions } = result.value

      expect(questions).toEqual([
        expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
        expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
      ])
    }
    expect(result.isRight()).toBe(true)
  })
})

