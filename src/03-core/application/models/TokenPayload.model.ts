type rolesType = {
  id: string;
  description: string;
};

type TokenPayload = {
  name: string;
  id: string;
  email: string | null;
  roles: rolesType[];
};
export default TokenPayload;
