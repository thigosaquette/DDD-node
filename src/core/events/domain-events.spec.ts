import { AggregateRoot } from "../entities/aggregate-root";
import { DomainEvent } from "./domain-event";
import { UniqueEntityID } from "../value-objects/unique-entity-id";
import { DomainEvents } from "./domain-events";
import { vi } from "vitest";

class CustomAggregateCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregateRoot

  constructor(aggregate: CustomAggregateRoot) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregateRoot extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregateRoot(null)

    aggregate.addDomainEvent(new CustomAggregateCreatedEvent(aggregate))
    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to create a new aggregate root', () => {
    const callbackSpy = vi.fn()
    
    // Register the callback to be called when the event is dispatched
    DomainEvents.register(callbackSpy, CustomAggregateCreatedEvent.name)

    // Create the aggregate and add the event to it
    const aggregate = CustomAggregateRoot.create()

    expect(aggregate.domainEvents).toHaveLength(1)
    expect(aggregate.domainEvents[0]).toBeInstanceOf(CustomAggregateCreatedEvent)
    expect(aggregate.domainEvents[0]?.getAggregateId().toString()).toBe(aggregate.id.toString())
    expect(aggregate.domainEvents[0]?.ocurredAt).toBeInstanceOf(Date)

    // Dispatch the events for the aggregate
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})