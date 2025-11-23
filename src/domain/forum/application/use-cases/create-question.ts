import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  never,
  { question: Question }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })
    
    const questionAttachments = attachmentsIds?.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({
      question,
    })
  }
}
