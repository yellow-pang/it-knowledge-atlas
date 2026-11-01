import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type Relation = { type: "prerequisite" | "related" | "compare"; id: string };
export type Concept = {
  id: string; name: string; domains: string[]; definition: string; summary: string;
  recall: { question: string; answer: string };
  relations: Relation[]; examAreaIds: string[];
  sources: { title: string; url: string; checked: string; scope: string }[];
  verification: "draft" | "needs_review" | "verified";
  aiAssistance: string; body: string;
};

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const nonempty = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const object = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);

export function parseConcepts(files: { name: string; text: string }[]): Concept[] {
  const errors: string[] = [];
  const concepts: Concept[] = [];
  const locations = new Map<Concept, string>();
  if (files.length === 0) errors.push("콘텐츠 파일이 없습니다.");
  for (const file of files) {
    const fail = (message: string) => errors.push(`${file.name}: ${message}`);
    const match = file.text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
    if (!match) { fail("Front Matter 구분자(---)가 없거나 잘못되었습니다."); continue; }
    let data: unknown;
    try { data = JSON.parse(match[1]); } catch { fail("Front Matter는 JSON 형식의 YAML이어야 합니다."); continue; }
    if (!object(data)) { fail("Front Matter는 객체여야 합니다."); continue; }
    const before = errors.length;
    for (const key of ["id", "name", "definition", "summary", "aiAssistance"]) if (!nonempty(data[key])) fail(`${key}: 비어 있지 않은 문자열이 필요합니다.`);
    if (!object(data.recall) || !nonempty(data.recall.question) || !nonempty(data.recall.answer)) fail("recall: 질문과 확인할 핵심 내용이 필요합니다.");
    if (nonempty(data.id) && !idPattern.test(data.id)) fail("id: 영문 소문자, 숫자, 하이픈만 허용합니다.");
    for (const key of ["domains", "examAreaIds"]) {
      if (!Array.isArray(data[key]) || !(data[key] as unknown[]).every((v) => nonempty(v) && idPattern.test(v))) fail(`${key}: ID 문자열 배열이 필요합니다.`);
    }
    if (Array.isArray(data.examAreaIds) && data.examAreaIds.length > 0) fail("examAreaIds: 검증된 시험 영역 연결 기능은 아직 지원하지 않습니다.");
    if (Array.isArray(data.domains) && data.domains.length === 0) fail("domains: 분야가 하나 이상 필요합니다.");
    if (!["draft", "needs_review", "verified"].includes(String(data.verification))) fail("verification: draft, needs_review, verified 중 하나가 필요합니다.");
    if (data.verification === "verified") fail("verification: 검토 기록을 지원할 때까지 verified를 사용할 수 없습니다.");
    if (!Array.isArray(data.relations) || !data.relations.every((r: unknown) => object(r) && ["prerequisite", "related", "compare"].includes(String(r.type)) && nonempty(r.id) && idPattern.test(r.id))) fail("relations: 허용된 유형(prerequisite, related, compare)과 대상 ID가 필요합니다.");
    if (!Array.isArray(data.sources) || data.sources.length === 0 || !data.sources.every((s: unknown) => {
      if (!object(s) || !nonempty(s.title) || !nonempty(s.url) || !nonempty(s.checked) || !/^\d{4}-\d{2}-\d{2}$/.test(s.checked) || Number.isNaN(Date.parse(s.checked)) || new Date(s.checked).toISOString().slice(0, 10) !== s.checked || !nonempty(s.scope)) return false;
      try { return new URL(s.url).protocol === "https:"; } catch { return false; }
    })) fail("sources: 제목, HTTPS URL, 확인일(YYYY-MM-DD), 검토 범위가 필요합니다.");
    if (!match[2].trim()) fail("본문이 비어 있습니다.");
    if (errors.length === before) {
      const concept = { ...(data as unknown as Omit<Concept, "body">), body: match[2].trim() };
      concepts.push(concept);
      locations.set(concept, file.name);
    }
  }
  const ids = new Map<string, string>();
  for (const c of concepts) { const previous = ids.get(c.id); if (previous) errors.push(`${locations.get(c)}: 중복 ID ${c.id} (처음 정의: ${previous})`); else ids.set(c.id, locations.get(c)!); }
  for (const c of concepts) for (const r of c.relations) if (!ids.has(r.id)) errors.push(`${locations.get(c)}: 존재하지 않는 개념 참조 ${r.id} (${r.type})`);
  if (errors.length) throw new Error(`콘텐츠 검증 실패:\n${errors.join("\n")}`);
  return concepts;
}

export function getConcepts(): Concept[] {
  const dir = join(process.cwd(), "content", "concepts");
  return parseConcepts(readdirSync(dir).filter((name) => name.endsWith(".md")).sort().map((name) => ({ name: join("content", "concepts", name), text: readFileSync(join(dir, name), "utf8") })));
}
