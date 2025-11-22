import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string
  page: number
  itemsPerPage?: number
}

interface FetchQuestionAnswersUseCaseResponse {
  answers: Answer[]
}

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
    itemsPerPage = 20,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
        itemsPerPage,
      },
    )

    return {
      answers,
    }
  }
}

