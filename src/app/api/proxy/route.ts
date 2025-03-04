import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { path, type } = req.query;

  if (!path || !type) {
    return res.status(400).json({ error: "Path and type are required" });
  }

  if (Array.isArray(path)) {
    return res.status(400).json({ error: "Path must be a single string" });
  }

  if (!validator.isURL(path)) {
    return res.status(400).json({ error: "Path must be a valid URL" });
  }

  if (Array.isArray(type)) {
    return res.status(400).json({ error: "Type must be a single string" });
  }

  if (!validator.isAlpha(type)) {
    return res.status(400).json({ error: "Type must be a valid string" });
  }

  let cloudinaryUrl = `https://res.cloudinary.com/duwyojrax/${type}/upload/${path}`;
  res.redirect(301, cloudinaryUrl);
}