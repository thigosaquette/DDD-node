import { UniqueEntityID } from "../value-objects/unique-entity-id"

export class Entity<RequiredProps> {
  private _id: UniqueEntityID
  protected requiredProps: RequiredProps

  get id() {
    return this._id
  }

  protected constructor(requiredProps: RequiredProps, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID(id)
    this.requiredProps = requiredProps
  }
}