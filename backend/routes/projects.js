const express = require("express");
const { getAllProjects } = require("../data/store");

const router = express.Router();

// 공개용 API: status가 published인 프로젝트만 내려준다. (초안은 절대 노출하지 않음)
router.get("/", async (req, res) => {
  try {
    const all = await getAllProjects();
    res.json({ ok: true, projects: all.filter((p) => p.status === "published") });
  } catch (err) {
    console.error("[projects] 목록 조회 실패:", err);
    res.status(500).json({ ok: false, error: "프로젝트 목록을 불러오지 못했습니다." });
  }
});

module.exports = router;
