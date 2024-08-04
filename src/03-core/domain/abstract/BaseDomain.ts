import IDomainEvent from './IDomainEvent';

abstract class BaseDomain<T> {
  _id: T;

  private readonly _domainEvents: IDomainEvent[] = [];

  constructor(id: T) {
    this._id = id;
  }

  private getDomainEvents(): IDomainEvent[] {
    return this._domainEvents.slice();
  }

  private clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }

  getAndClearDomainEvents(): IDomainEvent[] {
    const events = this.getDomainEvents();
    this.clearDomainEvents();
    return events;
  }
  protected raiseDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
  }
}

export default BaseDomain;
