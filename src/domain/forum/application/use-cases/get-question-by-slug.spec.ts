import { InMemoryQuestionsRepository } from '@/test/repository/in-memory-answers-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from '@/test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase // System Under Test

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.InsertASlug('example-question'),
    })

    await inMemoryQuestionsRepository.create(newQuestion) // Skip Use Case

    const { question } = await sut.execute({ slug: newQuestion.slug.value })

    expect(question.id).toBeTruthy()
    expect(inMemoryQuestionsRepository.items[0]?.slug.value).toEqual(
      newQuestion.slug.value,
    )
  })
})
