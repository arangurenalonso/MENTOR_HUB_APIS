type rolesType = {
  id: string;
  description: string;
};

type TokenPayload = {
  name: string;
  userId: string;
  email: string | null;
  roles: rolesType[];
};
export default TokenPayload;
