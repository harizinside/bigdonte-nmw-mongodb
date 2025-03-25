import { NextApiResponse } from "next";
import { verifyToken } from "@/utils/jwt";
import { AuthenticatedRequest } from "@/types/next"; // Import tipe request
import { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (handler: Function) => 
  async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = verifyToken(token);
      req.user = decoded as JwtPayload & { userId: string }; // Pastikan userId ada di payload

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };