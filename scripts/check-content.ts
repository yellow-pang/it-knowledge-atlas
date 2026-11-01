import { getExamData } from "../lib/exams.ts";
import { getConcepts } from "../lib/concepts.ts";
try { const concepts = getConcepts(); const exams = getExamData(concepts); console.log(`콘텐츠 검증 성공: ${concepts.length}개 개념, ${exams.syllabi.length}개 출제기준`); }
catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
