import { test } from "node:test";
import assert from "node:assert/strict";
import { getConcepts, parseConcepts } from "../lib/concepts.ts";

const base = { id: "one", name: "개념", domains: ["database"], definition: "정의", relations: [], examAreaIds: [], sources: [{ title: "출처", url: "https://example.com", checked: "2026-11-01", scope: "범위" }], verification: "needs_review", aiAssistance: "초안" };
const file = (data: unknown, body = "설명") => ({ name: "test.md", text: `---\n${JSON.stringify(data)}\n---\n${body}` });
test("실제 콘텐츠를 파싱하고 관계를 연결한다", () => { const concepts = getConcepts(); assert.ok(concepts.length >= 4); assert.ok(concepts.every(c => c.body && c.relations.every(r => concepts.some(target => target.id === r.id)))); });
test("누락, 잘못된 형식, 관계 유형과 본문을 검사한다", () => {
  assert.throws(() => parseConcepts([file({ ...base, name: "", domains: "database", relations: [{ type: "unknown", id: "one" }] }, "")]), /name:[\s\S]*domains:[\s\S]*relations:[\s\S]*본문/);
  assert.throws(() => parseConcepts([{ name: "bad.md", text: "---\n{broken}\n---\nbody" }]), /Front Matter/);
});
test("중복 ID와 끊어진 참조를 검사한다", () => {
  assert.throws(() => parseConcepts([file(base), file(base)]), /중복 ID/);
  assert.throws(() => parseConcepts([file({ ...base, relations: [{ type: "related", id: "missing" }] })]), /존재하지 않는 개념 참조 missing/);
});
