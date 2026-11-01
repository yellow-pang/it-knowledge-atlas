import { lstatSync, mkdirSync, openSync, closeSync, readFileSync, readdirSync, rmdirSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { parseConcepts } from "./concepts.ts";

type File = { name: string; text: string };
function markdownFiles(path: string): File[] {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw new Error(`심볼릭 링크는 지원하지 않습니다: ${path}`);
  if (stat.isDirectory()) return readdirSync(path).sort().flatMap(name => markdownFiles(join(path, name)));
  if (!stat.isFile() || !path.toLowerCase().endsWith(".md")) return [];
  return [{ name: path, text: readFileSync(path, "utf8") }];
}
function existingFiles(dir: string): File[] {
  return readdirSync(dir).filter(name => name.endsWith(".md")).sort().map(name => ({ name: join(dir, name), text: readFileSync(join(dir, name), "utf8") }));
}
export function planImport(source: string, dir: string) {
  const incoming = markdownFiles(resolve(source));
  if (!incoming.length) throw new Error("가져올 Markdown 파일이 없습니다.");
  const existing = existingFiles(dir);
  const current = parseConcepts(existing);
  const skipped: string[] = [];
  const candidates: File[] = [];
  for (const file of incoming) {
    if (existing.some(old => old.text === file.text)) skipped.push(file.name);
    else if (candidates.some(candidate => candidate.text === file.text)) skipped.push(file.name);
    else candidates.push(file);
  }
  // Validate the complete set, including references between files in this batch.
  const all = parseConcepts([...existing, ...candidates]);
  const added = all.slice(current.length);
  const warnings: string[] = [];
  for (const concept of added) {
    for (const other of all) {
      if (concept.id !== other.id && concept.name.trim().normalize("NFKC").toLowerCase() === other.name.trim().normalize("NFKC").toLowerCase()) warnings.push(`이름 중복 의심: ${concept.name} (${concept.id}, ${other.id})`);
    }
    if (/^(?:\s{0,3}(?:#{1,6}\s|[-*+]\s|\d+\.\s|>|```)|.*\[[^\]]+\]\([^)]+\))/m.test(concept.body)) warnings.push(`${concept.id}: 본문의 제목·목록·링크 등은 앱에서 Markdown으로 렌더링되지 않습니다.`);
  }
  const destinations = added.map(c => join(dir, `${c.id}.md`));
  for (const dest of destinations) {
    try { lstatSync(dest); throw new Error(`대상 파일이 이미 있습니다: ${dest}`); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  }
  return { candidates, added, destinations, skipped, warnings };
}
export function applyImport(source: string, dir: string) {
  // Lock cooperating imports, then re-read and revalidate immediately before writes.
  const lock = join(dir, ".content-import-lock");
  mkdirSync(lock);
  const created: string[] = [];
  try {
    const plan = planImport(source, dir);
    for (let i = 0; i < plan.candidates.length; i++) {
      const fd = openSync(plan.destinations[i], "wx");
      created.push(plan.destinations[i]);
      try { writeFileSync(fd, plan.candidates[i].text); } finally { closeSync(fd); }
    }
    parseConcepts(existingFiles(dir));
    return plan;
  } catch (error) {
    for (const path of created.reverse()) unlinkSync(path);
    throw error;
  } finally { rmdirSync(lock); }
}
export function prepareDraft(source: string, destination: string) {
  const files = markdownFiles(resolve(source));
  if (files.length !== 1) throw new Error("초안 준비에는 Markdown 파일 하나를 지정하세요.");
  const text = files[0].text;
  const title = text.match(/^#\s+(.+)$/m)?.[1] || basename(source, ".md");
  const data = { id: "", name: title, domains: [], definition: "", summary: "", recall: { question: "", answer: "" }, relations: [], examAreaIds: [], sources: [], verification: "draft", aiAssistance: "" };
  // Keep the complete original, including any front matter, for human review.
  writeFileSync(destination, `---\n${JSON.stringify(data, null, 2)}\n---\n\n${text}`, { flag: "wx" });
}
