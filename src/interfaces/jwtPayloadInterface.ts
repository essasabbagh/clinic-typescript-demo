import { Role } from "@prisma/client";

export default interface IJwtPayload {
  userId: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}
