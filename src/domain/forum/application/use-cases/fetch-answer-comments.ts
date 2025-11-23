import { Either, right } from '@/core/either'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
  itemsPerPage?: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
  never,
  { answerComments: AnswerComment[] }
>

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
    itemsPerPage = 20,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
        itemsPerPage,
      })

    return right({
      answerComments,
    })
  }
}

