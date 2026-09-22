const fs = require("fs");
const path = require("path");

// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY가 설정되어 있으면 Supabase(Postgres)를 쓰고,
// 없으면 지금까지처럼 로컬 JSON 파일을 쓴다. 로컬 개발은 DB 없이도 그대로 동작한다.
const DATA_FILE = path.join(__dirname, "projects.json");
const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

let supabase = null;
if (useSupabase) {
  const { createClient } = require("@supabase/supabase-js");
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// --- 파일 기반 저장 (DB 미연결일 때) ---
function readFile() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf-8").trim();
  return raw ? JSON.parse(raw) : [];
}

function writeFile(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

// --- DB 행 <-> 앱에서 쓰는 객체 형태 변환 ---
function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    role: row.role,
    description: row.description,
    date: row.date,
    memberCount: row.member_count,
    note: row.note,
    videoUrl: row.video_url,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(project) {
  return {
    id: project.id,
    title: project.title,
    role: project.role,
    description: project.description,
    date: project.date,
    member_count: project.memberCount,
    note: project.note,
    video_url: project.videoUrl,
    status: project.status,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  };
}

async function getAllProjects() {
  if (useSupabase) {
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data.map(fromRow);
  }
  return readFile();
}

async function createProject(project) {
  if (useSupabase) {
    const { data, error } = await supabase.from("projects").insert(toRow(project)).select().single();
    if (error) throw error;
    return fromRow(data);
  }
  const projects = readFile();
  projects.push(project);
  writeFile(projects);
  return project;
}

async function updateProject(id, patch) {
  if (useSupabase) {
    const { data, error } = await supabase
      .from("projects")
      .update(toRow(patch))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? fromRow(data) : null;
  }
  const projects = readFile();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  projects[index] = { ...projects[index], ...patch, id };
  writeFile(projects);
  return projects[index];
}

async function deleteProject(id) {
  if (useSupabase) {
    const { error, count } = await supabase.from("projects").delete({ count: "exact" }).eq("id", id);
    if (error) throw error;
    return count > 0;
  }
  const projects = readFile();
  const next = projects.filter((p) => p.id !== id);
  const deleted = next.length !== projects.length;
  if (deleted) writeFile(next);
  return deleted;
}

module.exports = { useSupabase, getAllProjects, createProject, updateProject, deleteProject };
