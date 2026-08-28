import jwt from "jsonwebtoken";

function parseCookies(header) {
  const list = {};
  if (!header) return list;
  header.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    list[parts.shift().trim()] = decodeURIComponent(parts.join("="));
  });
  return list;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.session;

  if (!token) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ id: decoded.id, name: decoded.name, email: decoded.email });
  } catch (err) {
    return res.status(401).json({ error: "Sessão inválida ou expirada" });
  }
}