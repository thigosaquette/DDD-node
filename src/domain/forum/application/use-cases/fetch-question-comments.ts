import { Either, right } from '@/core/either'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
  itemsPerPage?: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
  never,
  { questionComments: QuestionComment[] }
>

export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
    itemsPerPage = 20,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
        itemsPerPage,
      })

    return right({
      questionComments,
    })
  }
}

