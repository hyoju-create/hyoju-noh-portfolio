const { isValidSession } = require("../lib/authStore");

// Authorization: Bearer <token> 형태의 세션 토큰을 확인한다.
// 비밀번호 자체는 이 과정 어디에도 등장하지 않는다.
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!isValidSession(token)) {
    return res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
  }

  next();
}

module.exports = requireAdmin;
