import { join } from "node:path";
import { applyImport, planImport, prepareDraft } from "../lib/content-import.ts";

const [mode, source, destination] = process.argv.slice(2);
try {
  if (mode === "draft" && source && destination) {
    prepareDraft(source, destination);
    console.log(`검토용 초안 생성: ${destination}\n빈 항목을 채우고 원본 메타데이터와 본문을 검토하세요. 초안은 아직 등록되지 않았습니다.`);
  } else if ((mode === "preview" || mode === "apply") && source && !destination) {
    const dir = join(process.cwd(), "content", "concepts");
    const plan = mode === "apply" ? applyImport(source, dir) : planImport(source, dir);
    plan.added.forEach((c, i) => console.log(`${mode === "apply" ? "등록" : "등록 예정"}: ${c.id} (${c.name}) ← ${plan.candidates[i].name} → ${plan.destinations[i]}`));
    plan.skipped.forEach(name => console.log(`동일 파일 건너뜀: ${name}`));
    plan.warnings.forEach(warning => console.warn(`경고: ${warning}`));
    console.log(`${mode === "apply" ? "등록 완료" : "미리보기 완료"}: ${plan.added.length}개, 동일 파일 ${plan.skipped.length}개`);
  } else throw new Error("사용법: npm run content:import -- preview|apply <파일 또는 폴더> | draft <원본 파일> <초안 파일>");
} catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
