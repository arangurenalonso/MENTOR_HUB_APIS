import UserCreatedDomainEvent from '@domain/user-aggregate/root/events/user-created.domain-event';

const eventMapping: { [key: string]: any } = {
  UserCreatedDomainEvent: UserCreatedDomainEvent,
};

export default eventMapping;
