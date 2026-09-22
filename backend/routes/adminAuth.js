const express = require("express");
const bcrypt = require("bcryptjs");
const {
  createSession,
  isLoginBlocked,
  recordLoginFailure,
  clearLoginFailures,
} = require("../lib/authStore");

const router = express.Router();

router.post("/login", async (req, res) => {
  const ip = req.ip;
  const { password } = req.body || {};

  if (isLoginBlocked(ip)) {
    return res.status(429).json({ ok: false, error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요." });
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    console.error("[admin] ADMIN_PASSWORD_HASH가 설정되지 않았습니다.");
    return res.status(500).json({ ok: false, error: "서버에 관리자 비밀번호가 설정되지 않았습니다." });
  }

  if (typeof password !== "string" || !password) {
    return res.status(400).json({ ok: false, error: "비밀번호를 입력하세요." });
  }

  const isMatch = await bcrypt.compare(password, passwordHash);
  if (!isMatch) {
    recordLoginFailure(ip);
    return res.status(401).json({ ok: false, error: "비밀번호가 올바르지 않습니다." });
  }

  clearLoginFailures(ip);
  const token = createSession();
  res.json({ ok: true, token });
});

router.post("/logout", (req, res) => {
  // JWT는 서버가 따로 저장하지 않으므로 여기서 할 일은 없다.
  // 실제 "로그아웃"은 프론트엔드가 메모리에 든 토큰을 버리는 것으로 이루어진다.
  res.json({ ok: true });
});

module.exports = router;
