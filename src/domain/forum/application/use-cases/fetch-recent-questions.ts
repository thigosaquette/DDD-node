import { Either, right } from '@/core/either'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
  itemsPerPage?: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
  never,
  { questions: Question[] }
>

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
    itemsPerPage = 20,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({
      page,
      itemsPerPage,
    })

    return right({
      questions,
    })
  }
}

