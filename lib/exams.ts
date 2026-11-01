import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Concept } from "./concepts.ts";

type Source = { title: string; url: string; checked: string; scope: string };
type Status = "draft" | "needs_review" | "verified";
type Evidence = { source: Source; verification: Status; review?: string };
type Track = { id: string; name: string; source: Source };
type Syllabus = Evidence & { id: string; trackId: string; start: string; end: string };
type Area = Evidence & { id: string; syllabusId: string; name: string; parentId?: string };
type Relation = { conceptId: string; reason: string; verification: Status; review?: string };
type Paper = Evidence & { id: string; trackId: string; session: number; year: number; period?: number; question?: number; location?: string };
export type ExamData = { tracks: Track[]; syllabi: Syllabus[]; areas: Area[]; areaRelations: (Relation & { areaId: string })[]; papers: Paper[]; questionRelations: (Relation & { paperId: string })[] };
const keys = ["tracks", "syllabi", "areas", "areaRelations", "papers", "questionRelations"] as const;
const id = (s: unknown): s is string => typeof s === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
const str = (s: unknown): s is string => typeof s === "string" && !!s.trim();
const date = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
const obj = (s: unknown): s is Record<string, unknown> => !!s && typeof s === "object" && !Array.isArray(s);
function source(s: unknown): boolean {
  if (!obj(s) || !str(s.title) || !str(s.url) || !date(s.checked) || !str(s.scope)) return false;
  try { return new URL(s.url).protocol === "https:"; } catch { return false; }
}
function status(s: Record<string, unknown>): boolean {
  return ["draft", "needs_review", "verified"].includes(String(s.verification)) && (s.verification !== "verified" || str(s.review));
}
export function parseExamData(files: { name: string; text: string }[], concepts: Pick<Concept, "id">[]): ExamData {
  const all: Record<string, unknown[]> = Object.fromEntries(keys.map(k => [k, []]));
  const errors: string[] = [];
  for (const file of files) {
    const match = file.text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
    try {
      if (!match) throw Error("Front Matter 구분자 오류");
      const data: unknown = JSON.parse(match[1]);
      if (!obj(data) || keys.some(k => !Array.isArray(data[k]))) throw Error("시험 자료 배열 누락");
      for (const k of keys) all[k].push(...data[k] as unknown[]);
    } catch { errors.push(`${file.name}: 시험 자료 형식 오류`); }
  }
  const records = (key: string) => all[key].filter((v): v is Record<string, unknown> => { if (!obj(v)) { errors.push(`${key}: 객체 필요`); return false; } return true; });
  const tracks = records("tracks"), syllabi = records("syllabi"), areas = records("areas"), papers = records("papers"), ar = records("areaRelations"), qr = records("questionRelations");
  const ids = (rows: Record<string, unknown>[], label: string) => { const set = new Set<string>(); for (const row of rows) { if (!id(row.id) || set.has(row.id)) errors.push(`${label}: ID 오류 또는 중복 ${row.id}`); else set.add(row.id); } return set; };
  const trackIds = ids(tracks, "종목"), syllabusIds = ids(syllabi, "기준"), areaIds = ids(areas, "영역"), paperIds = ids(papers, "문제");
  const conceptIds = new Set(concepts.map(c => c.id));
  for (const t of tracks) if (!str(t.name) || !source(t.source)) errors.push(`종목 ${t.id}: 이름 또는 출처 오류`);
  for (const s of syllabi) if (!trackIds.has(String(s.trackId)) || !date(s.start) || !date(s.end) || s.start > s.end || !source(s.source) || !status(s)) errors.push(`기준 ${s.id}: 참조, 기간, 출처 또는 상태 오류`);
  for (const a of areas) {
    if (!syllabusIds.has(String(a.syllabusId)) || !str(a.name) || !source(a.source) || !status(a)) errors.push(`영역 ${a.id}: 참조, 출처 또는 상태 오류`);
    if (a.parentId !== undefined && (!areaIds.has(String(a.parentId)) || a.parentId === a.id || !areas.some(p => p.id === a.parentId && p.syllabusId === a.syllabusId))) errors.push(`영역 ${a.id}: 상위 영역 오류`);
    const seen = new Set<unknown>([a.id]); let parent = a.parentId;
    while (parent !== undefined) { if (seen.has(parent)) { errors.push(`영역 ${a.id}: 상위 영역 순환`); break; } seen.add(parent); parent = areas.find(p => p.id === parent)?.parentId; }
  }
  const identities = new Set<string>();
  for (const p of papers) {
    if (!trackIds.has(String(p.trackId)) || !Number.isInteger(p.session) || Number(p.session) < 1 || !Number.isInteger(p.year) || Number(p.year) < 1900 || !source(p.source) || !status(p) || (p.period !== undefined && (!Number.isInteger(p.period) || Number(p.period) < 1)) || (p.question !== undefined && (!Number.isInteger(p.question) || Number(p.question) < 1 || p.period === undefined)) || (p.location !== undefined && !str(p.location))) errors.push(`문제 ${p.id}: 참조, 식별 정보, 출처 또는 상태 오류`);
    const identity = [p.trackId, p.session, p.period ?? "paper", p.question ?? "paper"].join(":"); if (identities.has(identity)) errors.push(`중복 기출문제 ${identity}`); identities.add(identity);
  }
  for (const [rows, field, targets] of [[ar, "areaId", areaIds], [qr, "paperId", paperIds]] as const) {
    const seen = new Set<string>();
    for (const r of rows) { const pair = `${r.conceptId}:${r[field]}`; if (!conceptIds.has(String(r.conceptId)) || !targets.has(String(r[field])) || !str(r.reason) || !status(r) || seen.has(pair)) errors.push(`관계 ${pair}: 참조, 근거, 상태 오류 또는 중복`); seen.add(pair); }
  }
  if (errors.length) throw new Error(`시험 콘텐츠 검증 실패:\n${errors.join("\n")}`);
  return all as ExamData;
}
export function getExamData(concepts: Pick<Concept, "id">[]): ExamData {
  const dir = join(process.cwd(), "content", "exams");
  return parseExamData(readdirSync(dir).filter(n => n.endsWith(".md")).sort().map(n => ({ name: n, text: readFileSync(join(dir, n), "utf8") })), concepts);
}
