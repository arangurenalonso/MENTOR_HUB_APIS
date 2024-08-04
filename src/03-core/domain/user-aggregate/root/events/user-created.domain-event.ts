import IDomainEvent from '@domain/abstract/IDomainEvent';

class UserCreatedDomainEvent implements IDomainEvent {
  constructor(public value?: string) {}
}
export default UserCreatedDomainEvent;
