import { getConcepts } from "../lib/concepts.ts";
try { console.log(`콘텐츠 검증 성공: ${getConcepts().length}개 개념`); }
catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
