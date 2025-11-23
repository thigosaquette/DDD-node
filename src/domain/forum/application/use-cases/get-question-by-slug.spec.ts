import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repository/in-memory-question-attachments-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { makeQuestion } from '@/test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase // System Under Test

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.InsertASlug('example-question'),
    })

    await inMemoryQuestionsRepository.create(newQuestion) // Skip Use Case

    const result = await sut.execute({ slug: newQuestion.slug.value })

    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.items[0]?.slug.value).toEqual(
        newQuestion.slug.value,
      )
      expect(result.value.question.id).toBeTruthy()
    }
    expect(result.isRight()).toBe(true)
  })
})
