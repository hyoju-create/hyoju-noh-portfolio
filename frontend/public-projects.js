// 관리자 페이지에서 "공개"로 저장한 프로젝트를 불러와 화면에 자동으로 표시한다.
// 기존에 손으로 작성해둔 프로젝트 카드(위쪽 4개)는 건드리지 않는다.
(async () => {
  const grid = document.getElementById("managedProjectsGrid");
  if (!grid) return;

  try {
    const res = await fetch("/api/projects");
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.projects) || data.projects.length === 0) return;

    grid.innerHTML = data.projects
      .map(
        (p) => `
      <div class="project-card">
        ${p.videoUrl ? `<video src="${escapeHtml(p.videoUrl)}" controls preload="metadata" style="width:100%;border-radius:12px 12px 0 0;display:block;"></video>` : ""}
        <div class="project-body">
          <h3 class="project-title">${escapeHtml(p.title)}</h3>
          <p class="project-summary">${escapeHtml(p.description)}</p>
          <div class="project-tech-tags">
            <span>${escapeHtml(p.role)}</span>
            <span>${escapeHtml(p.date)}</span>
            <span>참여인원 ${escapeHtml(p.memberCount)}</span>
          </div>
          ${p.note ? `<p class="project-summary" style="margin-top:8px;">${escapeHtml(p.note)}</p>` : ""}
        </div>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error("프로젝트 목록을 불러오지 못했습니다.", err);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
})();
