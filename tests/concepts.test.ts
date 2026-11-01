import { test } from "node:test";
import assert from "node:assert/strict";
import { getConcepts, parseConcepts } from "../lib/concepts.ts";

const base = { id: "one", name: "개념", domains: ["database"], definition: "정의", summary: "요약", recall: { question: "키워드는?", answer: "핵심" }, relations: [], examAreaIds: [], sources: [{ title: "출처", url: "https://example.com", checked: "2026-11-01", scope: "범위" }], verification: "needs_review", aiAssistance: "초안" };
const file = (data: unknown, body = "설명") => ({ name: "test.md", text: `---\n${JSON.stringify(data)}\n---\n${body}` });
test("실제 콘텐츠를 파싱하고 관계를 연결한다", () => { const concepts = getConcepts(); assert.ok(concepts.length >= 4); assert.ok(concepts.every(c => c.body && c.relations.every(r => concepts.some(target => target.id === r.id)))); });
test("누락, 잘못된 형식, 관계 유형과 본문을 검사한다", () => {
  assert.throws(() => parseConcepts([file({ ...base, name: "", domains: "database", relations: [{ type: "unknown", id: "one" }] }, "")]), /name:[\s\S]*domains:[\s\S]*relations:[\s\S]*본문/);
  assert.throws(() => parseConcepts([{ name: "bad.md", text: "---\n{broken}\n---\nbody" }]), /Front Matter/);
  assert.throws(() => parseConcepts([file({ ...base, summary: "", recall: { question: "", answer: "" } })]), /summary:[\s\S]*recall:/);
});
test("중복 ID와 끊어진 참조를 검사한다", () => {
  assert.throws(() => parseConcepts([{ ...file(base), name: "first.md" }, { ...file(base), name: "second.md" }]), /second\.md: 중복 ID one \(처음 정의: first\.md\)/);
  assert.throws(() => parseConcepts([file({ ...base, relations: [{ type: "related", id: "missing" }] })]), /test\.md: 존재하지 않는 개념 참조 missing/);
});
test("파일명과 무관하게 ID로 관계를 연결한다", () => {
  const concepts = parseConcepts([
    { ...file({ ...base, relations: [{ type: "prerequisite", id: "two" }] }), name: "renamed.md" },
    { ...file({ ...base, id: "two" }), name: "unrelated-filename.md" },
  ]);
  assert.equal(concepts[0].relations[0].id, concepts[1].id);
});
test("출처와 검증 상태를 검사한다", () => {
  for (const sources of [[], [{ title: "출처", url: "http://example.com", checked: "2026-11-01", scope: "범위" }], [{ title: "출처", url: "https://example.com", checked: "2026-02-30", scope: "범위" }]]) {
    assert.throws(() => parseConcepts([file({ ...base, sources })]), /sources:/);
  }
  assert.throws(() => parseConcepts([file({ ...base, verification: "verified" })]), /검토 기록/);
  assert.throws(() => parseConcepts([file({ ...base, verification: "unknown" })]), /verification:/);
});
