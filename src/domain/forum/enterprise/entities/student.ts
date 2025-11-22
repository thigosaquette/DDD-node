import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/value-objects/unique-entity-id'

interface StudentRequiredProps {
  name: string
}

export class Student extends Entity<StudentRequiredProps> {
  static create(requiredProps: StudentRequiredProps, id?: UniqueEntityID) {
    const student = new Student(requiredProps, id)

    return student
  }
}
