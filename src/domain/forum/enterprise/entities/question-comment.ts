import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { Comment, CommentRequiredProps } from './comment'

export interface QuestionCommentRequiredProps extends CommentRequiredProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentRequiredProps> {
  get questionId() {
    return this.requiredProps.questionId
  }

  static create(
    requiredProps: Optional<QuestionCommentRequiredProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      {
        ...requiredProps,
        createdAt: requiredProps.createdAt ?? new Date(),
      },
      id,
    )

    return questionComment
  }
}

