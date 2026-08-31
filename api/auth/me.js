import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.session;

  if (!token) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  app.get('/api/auth/me', (req, res) => {
  return res.json({ id: 1, email: 'teste@email.com', name: 'Usuário Teste' });
});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ id: decoded.id, name: decoded.name, email: decoded.email });
  } catch (err) {
    return res.status(401).json({ error: "Sessão inválida ou expirada" });
  }
}