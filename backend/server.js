require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const contactRouter = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 프론트엔드에서 연결 상태를 확인할 수 있는 헬스체크
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "백엔드 서버가 정상적으로 동작 중입니다." });
});

app.use("/api/contact", contactRouter);

async function start() {
  await connectDB(); // DATABASE_URL이 없으면 연결을 건너뛰고 계속 진행한다.
  app.listen(PORT, () => {
    console.log(`[server] http://localhost:${PORT} 에서 실행 중`);
  });
}

start();
