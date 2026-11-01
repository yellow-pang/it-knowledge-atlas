import { test } from "node:test";
import assert from "node:assert/strict";
import { getExamData, parseExamData } from "../lib/exams.ts";
import { getConcepts } from "../lib/concepts.ts";
const source = { title: "공식", url: "https://example.com", checked: "2026-11-01", scope: "대조" };
const data = { tracks: [{id:"track", name:"종목", source}], syllabi: [{id:"old", trackId:"track", start:"2023-01-01", end:"2026-12-31", source, verification:"needs_review"}, {id:"new", trackId:"track", start:"2027-01-01", end:"2030-12-31", source, verification:"needs_review"}], areas: [{id:"area", syllabusId:"old", name:"영역", source, verification:"verified", review:"원문 대조 2026-11-01"}], areaRelations: [{conceptId:"one", areaId:"area", reason:"대조", verification:"verified", review:"대조 2026-11-01"}], papers: [{id:"paper", trackId:"track", session:137, year:2025, source, verification:"needs_review"}], questionRelations: [] };
const parse = (value: unknown) => parseExamData([{name:"시험.md", text:`---\n${JSON.stringify(value)}\n---\n본문`}], [{id:"one"}]);
test("실제 자료는 버전별 연결과 공식 문제 위치를 보존한다", () => { const d = getExamData(getConcepts()); assert.deepEqual(d.syllabi.map(s => [s.start,s.end]), [["2023-01-01","2026-12-31"],["2027-01-01","2030-12-31"]]); assert.equal(d.areaRelations[0].conceptId, "isolation-level"); assert.equal(d.areas.find(a => a.id === d.areaRelations[0].areaId)?.syllabusId, d.syllabi[0].id); assert.equal(d.areas.find(a => a.id === d.areaRelations[1].areaId)?.syllabusId, d.syllabi[1].id); assert.deepEqual([d.papers[1].period, d.papers[1].question], [3,4]); assert.equal(d.questionRelations[0].paperId, d.papers[1].id); });
test("버전 추가 시 기존 연결을 보존한다", () => { const d = parse(data); assert.equal(d.areaRelations[0].areaId, "area"); assert.equal(d.areas[0].syllabusId, "old"); assert.equal(d.syllabi.length, 2); });
test("중복과 잘못된 참조, 기간, 출처 및 검토를 거부한다", () => {
  for (const bad of [
    {...data, tracks:[...data.tracks, data.tracks[0]]},
    {...data, syllabi:[{...data.syllabi[0], trackId:"missing"}]},
    {...data, syllabi:[{...data.syllabi[0], end:"2022-01-01"}]},
    {...data, areas:[{...data.areas[0], syllabusId:"missing"}]},
    {...data, areaRelations:[{...data.areaRelations[0], conceptId:"missing"}]},
    {...data, areaRelations:[{...data.areaRelations[0], areaId:"missing"}]},
    {...data, areaRelations:[{...data.areaRelations[0], verification:"verified", review:""}]},
    {...data, areaRelations:[{...data.areaRelations[0], verification:["verified"], review:""}]},
    {...data, syllabi:[{...data.syllabi[0], verification:["needs_review"]}]},
    {...data, papers:[data.papers[0], {...data.papers[0], id:"other"}]},
    {...data, papers:[{...data.papers[0], source:{...source, url:"http://example.com"}}]},
    {...data, questionRelations:[{conceptId:"one", paperId:"missing", reason:"대조", verification:"draft"}]},
  ]) assert.throws(() => parse(bad), /시험 콘텐츠 검증 실패/);
});
