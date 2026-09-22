const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// 업로드한 영상은 프론트엔드가 바로 서빙할 수 있도록 frontend/assets/videos 에 저장한다.
const VIDEO_DIR = path.join(__dirname, "..", "..", "frontend", "assets", "videos");
fs.mkdirSync(VIDEO_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, VIDEO_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".avi", ".mkv"];

const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 * 1024 }, // 300MB
  fileFilter: (req, file, cb) => {
    // 브라우저는 대부분 정확한 video/* MIME 타입을 보내지만,
    // 일부 도구는 application/octet-stream으로 보내기도 해서 확장자도 함께 확인한다.
    const isVideoMime = file.mimetype.startsWith("video/");
    const isVideoExt = VIDEO_EXTENSIONS.includes(path.extname(file.originalname).toLowerCase());
    if (!isVideoMime && !isVideoExt) {
      return cb(new Error("영상 파일만 업로드할 수 있습니다."));
    }
    cb(null, true);
  },
});

router.use(requireAdmin);

router.post("/video", (req, res) => {
  upload.single("video")(req, res, (err) => {
    if (err) return res.status(400).json({ ok: false, error: err.message });
    if (!req.file) return res.status(400).json({ ok: false, error: "업로드할 파일이 없습니다." });
    res.json({ ok: true, url: `assets/videos/${req.file.filename}` });
  });
});

module.exports = router;
