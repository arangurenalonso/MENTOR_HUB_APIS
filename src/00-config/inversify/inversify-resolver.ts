import { Container } from 'inversify';
import { IResolver } from 'mediatr-ts';

class InversifyResolver implements IResolver {
  constructor(private container: Container) {}

  resolve<T>(name: string): T {
    return this.container.get<T>(name);
  }

  add(name: string, instance: Function): void {
    this.container.bind(name).to(instance as any);
  }

  remove(name: string): void {
    this.container.unbind(name);
  }

  clear(): void {
    this.container.unbindAll();
  }
}
export default InversifyResolver;
