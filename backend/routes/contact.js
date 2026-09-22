const express = require("express");
const router = express.Router();

// 문의(연락처) 폼 제출 처리
// 현재는 DB가 연결되지 않아 저장하지 않고, 요청이 정상적으로 들어왔는지만 확인한다.
// DB 연결 후에는 이 자리에서 저장 로직을 추가하면 된다.
router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "name, email, message는 필수입니다." });
  }

  console.log("[contact] 새 문의:", { name, email, message });

  // TODO: DB 연결 후 저장 로직 추가
  // 예) await db.collection('contacts').insertOne({ name, email, message, createdAt: new Date() });

  res.json({ ok: true, message: "문의가 접수되었습니다." });
});

module.exports = router;
