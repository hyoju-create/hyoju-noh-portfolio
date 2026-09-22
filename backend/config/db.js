// 데이터베이스 연결 설정 (아직 미연결 상태)
//
// 나중에 DB를 연결할 때 이 파일에서 커넥션을 만들고 export 하면 된다.
// 예) PostgreSQL(pg), MongoDB(mongoose) 등 실제 사용할 DB가 정해지면
//     아래에 연결 코드를 추가하고, server.js에서 connectDB()를 호출한다.

async function connectDB() {
  if (!process.env.DATABASE_URL) {
    console.log("[DB] DATABASE_URL이 설정되지 않아 DB 연결을 건너뜁니다.");
    return null;
  }

  // TODO: 실제 DB 클라이언트 연결 코드 작성
  throw new Error("DB 연결 로직이 아직 구현되지 않았습니다.");
}

module.exports = { connectDB };
