import IDomainEvent from '@domain/abstract/IDomainEvent';

class UserCreatedDomainEvent implements IDomainEvent {
  constructor(public idUser: string) {}
}
export default UserCreatedDomainEvent;
