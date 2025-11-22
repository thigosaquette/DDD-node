import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'

interface InstructorRequiredProps {
  name: string
}

export class Instructor extends Entity<InstructorRequiredProps> {
  static create(requiredProps: InstructorRequiredProps, id?: UniqueEntityID) {
    const instructor = new Instructor(requiredProps, id)

    return instructor
  }
}
