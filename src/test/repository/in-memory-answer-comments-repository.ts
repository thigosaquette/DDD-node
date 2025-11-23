import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(answerComment.id))

    this.items.splice(itemIndex, 1)
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(
    answerId: string,
    { page, itemsPerPage }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    )

    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    return answerComments
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(startIndex, endIndex)
  }
}

