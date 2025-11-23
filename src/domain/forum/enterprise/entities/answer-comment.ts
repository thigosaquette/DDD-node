import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { Comment, CommentRequiredProps } from './comment'

export interface AnswerCommentRequiredProps extends CommentRequiredProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentRequiredProps> {
  get answerId() {
    return this.requiredProps.answerId
  }

  static create(
    requiredProps: Optional<AnswerCommentRequiredProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...requiredProps,
        createdAt: requiredProps.createdAt ?? new Date(),
      },
      id,
    )

    return answerComment
  }
}

