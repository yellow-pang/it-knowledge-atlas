import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { applyImport, planImport, prepareDraft } from "../lib/content-import.ts";

const base = { id: "one", name: "개념", domains: ["database"], definition: "정의", summary: "요약", recall: { question: "질문", answer: "답" }, relations: [], examAreaIds: [], sources: [{ title: "출처", url: "https://example.com", checked: "2026-11-01", scope: "범위" }], verification: "draft", aiAssistance: "없음" };
const content = (data: unknown) => `---\n${JSON.stringify(data)}\n---\n설명\n`;
test("미리보기와 일괄 등록, 재등록, 참조 및 원본 보존", () => {
  const root = mkdtempSync(join(tmpdir(), "atlas-import-"));
  try {
    const dir = join(root, "content"), input = join(root, "input"); mkdirSync(dir); mkdirSync(input);
    const first = content(base), second = content({ ...base, id: "two", name: "두 번째", relations: [{ type: "related", id: "one" }] });
    writeFileSync(join(input, "a.md"), first); writeFileSync(join(input, "b.md"), second);
    // The existing parser requires at least one concept in the repository.
    writeFileSync(join(dir, "existing.md"), content({ ...base, id: "existing", name: "기존" }));
    assert.equal(planImport(input, dir).added.length, 2); assert.equal(readdirSync(dir).length, 1);
    assert.equal(applyImport(input, dir).added.length, 2);
    assert.equal(readFileSync(join(input, "a.md"), "utf8"), first);
    assert.equal(applyImport(input, dir).skipped.length, 2);
    assert.equal(readdirSync(dir).length, 3);
    for (const bad of [content({ ...base, id: "existing" }), content({ ...base, id: "bad", name: "" }), content({ ...base, id: "bad", relations: [{ type: "bad", id: "one" }] }), content({ ...base, id: "bad", relations: [{ type: "related", id: "missing" }] }), "---\n{oops}\n---\n본문"]) {
      writeFileSync(join(root, "bad.md"), bad);
      assert.throws(() => applyImport(join(root, "bad.md"), dir));
      assert.equal(readdirSync(dir).length, 3);
    }
    writeFileSync(join(root, "note.md"), "# 제목\n\n원본 내용");
    prepareDraft(join(root, "note.md"), join(root, "draft.md"));
    assert.match(readFileSync(join(root, "draft.md"), "utf8"), /원본 내용/);
    assert.throws(() => prepareDraft(join(root, "note.md"), join(root, "draft.md")));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
