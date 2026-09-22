const jwt = require("jsonwebtoken");

// 세션은 JWT로 발급한다. 서버가 세션을 따로 기억하지 않아도 검증할 수 있어서
// Vercel 같은 서버리스 환경(요청마다 다른 서버가 뜰 수 있음)에서도 안전하게 동작한다.
// 단점: 로그아웃해도 즉시 무효화되진 않는다. 대신 유효시간을 짧게(2시간) 둔다.
const SESSION_TTL_SECONDS = 2 * 60 * 60; // 2시간

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET이 설정되지 않았습니다.");
  return secret;
}

function createSession() {
  return jwt.sign({ role: "admin" }, getSecret(), { expiresIn: SESSION_TTL_SECONDS });
}

function isValidSession(token) {
  if (!token) return false;
  try {
    jwt.verify(token, getSecret());
    return true;
  } catch (_) {
    return false;
  }
}

// 무차별 대입(브루트포스) 공격 방어: IP별 로그인 실패 횟수를 제한한다.
// (서버리스 환경에서는 인스턴스가 자주 바뀌어 완벽하지 않을 수 있지만, 기본적인 방어로는 유효하다.)
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 5 * 60 * 1000; // 5분
const loginAttempts = new Map(); // ip -> { count, windowStart }

function isLoginBlocked(ip) {
  const entry = loginAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.windowStart > LOGIN_WINDOW_MS) {
    loginAttempts.delete(ip);
    return false;
  }
  return entry.count >= LOGIN_LIMIT;
}

function recordLoginFailure(ip) {
  const entry = loginAttempts.get(ip);
  if (!entry || Date.now() - entry.windowStart > LOGIN_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, windowStart: Date.now() });
    return;
  }
  entry.count += 1;
}

function clearLoginFailures(ip) {
  loginAttempts.delete(ip);
}

module.exports = {
  createSession,
  isValidSession,
  isLoginBlocked,
  recordLoginFailure,
  clearLoginFailures,
};
