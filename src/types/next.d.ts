import { NextApiRequest } from "next";
import { JwtPayload } from "jsonwebtoken"; 

export interface AuthenticatedRequest extends NextApiRequest {
  user?: JwtPayload & { userId: string }; // Sesuaikan dengan payload JWT
}