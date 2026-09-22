// 공개(published) 상태일 때만 필수값을 검사한다. 초안(draft)은 빈칸이어도 저장 가능.
const REQUIRED_FIELDS = ["title", "role", "description", "date", "memberCount"];

function validateProject(project) {
  if (project.status !== "draft" && project.status !== "published") {
    return "status는 draft 또는 published여야 합니다.";
  }

  if (project.status === "published") {
    for (const field of REQUIRED_FIELDS) {
      const value = project[field];
      if (value === undefined || value === null || String(value).trim() === "") {
        return `공개하려면 '${field}' 항목을 입력해야 합니다.`;
      }
    }
  }

  return null;
}

// 제목을 정규화해서(공백/대소문자 제거) 같은 프로젝트인지 단순 비교한다.
function normalizeTitle(title) {
  return String(title || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

// 제목이 같은 프로젝트끼리 묶어서 중복 후보 그룹을 반환한다.
function findDuplicateGroups(projects) {
  const groups = new Map();

  for (const project of projects) {
    const key = normalizeTitle(project.title);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(project);
  }

  return [...groups.values()].filter((group) => group.length > 1);
}

module.exports = { validateProject, normalizeTitle, findDuplicateGroups };
