const {
  constantTimeEqual,
  createSessionToken,
  sessionCookie
} = require("../../lib/admin-auth.js");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!expectedUsername || !expectedPassword || !sessionSecret || sessionSecret.length < 32) {
    return res.status(500).json({ error: "O acesso administrativo ainda não foi configurado." });
  }

  const { username, password } = req.body || {};
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !constantTimeEqual(username, expectedUsername) ||
    !constantTimeEqual(password, expectedPassword)
  ) {
    return res.status(401).json({ error: "Usuário ou senha incorretos." });
  }

  const token = createSessionToken(expectedUsername, sessionSecret);
  res.setHeader("Set-Cookie", sessionCookie(token));
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ ok: true });
};
