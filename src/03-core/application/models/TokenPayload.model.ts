type rolesType = {
  id: string;
  description: string;
};
type timeZoneType = {
  id: string;
  offsetMinutes: number;
  offsetHours: number;
  timeZoneStringId: string;
  description: string;
};

type TokenPayload = {
  name: string;
  id: string;
  email: string | null;
  roles: rolesType[];
  timeZone: timeZoneType;
};
export default TokenPayload;
