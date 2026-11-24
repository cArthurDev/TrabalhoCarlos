const crypto = require("node:crypto");

const SESSION_COOKIE = "quiz_admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function constantTimeEqual(left, right) {
  const leftHash = crypto.createHash("sha256").update(left).digest();
  const rightHash = crypto.createHash("sha256").update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

function createSessionToken(username, secret) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = `${username}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${expiresAt}.${signature}`;
}

function isAdminRequest(req) {
  const username = process.env.ADMIN_USERNAME;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookieHeader = req.headers.cookie || "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));

  if (!username || !secret || secret.length < 32 || !cookie) {
    return false;
  }

  const token = cookie.slice(SESSION_COOKIE.length + 1);
  const separator = token.indexOf(".");
  if (separator === -1) {
    return false;
  }

  const expiresAt = Number(token.slice(0, separator));
  const signature = token.slice(separator + 1);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${username}:${expiresAt}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return constantTimeEqual(signature, expectedSignature);
}

function sessionCookie(token) {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}`;
}

function expiredSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

module.exports = {
  constantTimeEqual,
  createSessionToken,
  expiredSessionCookie,
  isAdminRequest,
  sessionCookie
};
