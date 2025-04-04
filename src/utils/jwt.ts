import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Tentukan tipe payload JWT
interface TokenPayload extends JwtPayload {
  userId: string;
}

// Fungsi untuk membuat token
export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
}

// Fungsi untuk memverifikasi token
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}