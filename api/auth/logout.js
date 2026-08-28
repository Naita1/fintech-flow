export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  res.setHeader(
    "Set-Cookie",
    "session=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  return res.status(200).json({ success: true });
}