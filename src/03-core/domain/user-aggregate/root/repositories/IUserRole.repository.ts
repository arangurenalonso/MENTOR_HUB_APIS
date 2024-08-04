import UserDomain from '../user.domain';

interface IUserRoleRepository {
  register(user: UserDomain): Promise<void>;
}
export default IUserRoleRepository;
