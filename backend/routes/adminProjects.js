const express = require("express");
const crypto = require("crypto");
const requireAdmin = require("../middleware/requireAdmin");
const { getAllProjects, createProject, updateProject, deleteProject } = require("../data/store");
const { validateProject, findDuplicateGroups } = require("../lib/projectRules");

const router = express.Router();

router.use(requireAdmin);

// 관리자는 초안/공개 상관없이 전체 목록을 본다.
router.get("/", async (req, res) => {
  try {
    res.json({ ok: true, projects: await getAllProjects() });
  } catch (err) {
    console.error("[admin/projects] 목록 조회 실패:", err);
    res.status(500).json({ ok: false, error: "목록을 불러오지 못했습니다." });
  }
});

router.post("/", async (req, res) => {
  const body = req.body || {};
  const now = new Date().toISOString();
  const project = {
    id: crypto.randomUUID(),
    title: body.title || "",
    role: body.role || "",
    description: body.description || "",
    date: body.date || "",
    memberCount: body.memberCount || "",
    note: body.note || "",
    videoUrl: body.videoUrl || "",
    status: body.status === "published" ? "published" : "draft",
    createdAt: now,
    updatedAt: now,
  };

  const error = validateProject(project);
  if (error) return res.status(400).json({ ok: false, error });

  try {
    const saved = await createProject(project);
    res.status(201).json({ ok: true, project: saved });
  } catch (err) {
    console.error("[admin/projects] 생성 실패:", err);
    res.status(500).json({ ok: false, error: "저장하지 못했습니다." });
  }
});

router.put("/:id", async (req, res) => {
  const body = req.body || {};
  const existing = (await getAllProjects()).find((p) => p.id === req.params.id);
  if (!existing) return res.status(404).json({ ok: false, error: "프로젝트를 찾을 수 없습니다." });

  const updated = {
    ...existing,
    title: body.title ?? existing.title,
    role: body.role ?? existing.role,
    description: body.description ?? existing.description,
    date: body.date ?? existing.date,
    memberCount: body.memberCount ?? existing.memberCount,
    note: body.note ?? existing.note,
    videoUrl: body.videoUrl ?? existing.videoUrl,
    status: body.status === "published" ? "published" : "draft",
    updatedAt: new Date().toISOString(),
  };

  const error = validateProject(updated);
  if (error) return res.status(400).json({ ok: false, error });

  try {
    const saved = await updateProject(req.params.id, updated);
    res.json({ ok: true, project: saved });
  } catch (err) {
    console.error("[admin/projects] 수정 실패:", err);
    res.status(500).json({ ok: false, error: "수정하지 못했습니다." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, error: "프로젝트를 찾을 수 없습니다." });
    res.json({ ok: true });
  } catch (err) {
    console.error("[admin/projects] 삭제 실패:", err);
    res.status(500).json({ ok: false, error: "삭제하지 못했습니다." });
  }
});

// 제목이 같은 프로젝트를 묶어서 보여준다. (통합/삭제는 관리자가 화면에서 직접 선택)
router.get("/duplicates/list", async (req, res) => {
  try {
    const groups = findDuplicateGroups(await getAllProjects());
    res.json({ ok: true, groups });
  } catch (err) {
    console.error("[admin/projects] 중복 조회 실패:", err);
    res.status(500).json({ ok: false, error: "중복 목록을 불러오지 못했습니다." });
  }
});

module.exports = router;
