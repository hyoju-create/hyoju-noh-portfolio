// Vercel은 api/ 아래 파일을 서버리스 함수로 인식한다.
// 실제 로직은 그대로 server.js의 Express 앱을 재사용한다.
module.exports = require("../server");
