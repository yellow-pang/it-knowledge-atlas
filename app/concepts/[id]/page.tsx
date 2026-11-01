import Link from "next/link";
import { notFound } from "next/navigation";
import { getConcepts } from "@/lib/concepts";
import { getExamData } from "@/lib/exams";
import { ReviewForm } from "./review-form";

export const dynamic = "force-dynamic";
export function generateStaticParams() { return getConcepts().map(({ id }) => ({ id })); }
export default async function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concepts = getConcepts();
  const concept = concepts.find((item) => item.id === id);
  if (!concept) notFound();
  const exams = getExamData(concepts);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const labels = { prerequisite: "먼저 알아두면 좋아요", related: "함께 알아보기", compare: "비교해 보기" } as const;
  return <main className="shell detail-shell"><header className="site-header"><Link className="brand" href="/">IT KNOWLEDGE ATLAS</Link><Link className="back" href="/">← 오늘의 학습</Link></header>
    <article><div className="detail-title">{concept.domains.map((domain) => <span className="tag" key={domain}>{domain === "database" ? "데이터베이스" : domain}</span>)}<h1>{concept.name}</h1><p className="definition">{concept.definition}</p></div>
      <div className="detail-grid"><div><section className="reading"><p className="eyebrow">30초 요약</p><h2>핵심만 먼저</h2><p>{concept.summary}</p></section>
      <section className="reading full-reading"><p className="eyebrow">3분 학습</p><h2>원리와 사례 이해하기</h2>{concept.body.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph.replace(/\n/g, " ")}</p>)}</section>
      <section className="reading"><p className="eyebrow">EXAM · 공식 자료</p><h2>기술사와 연결하기</h2>
        {exams.syllabi.map(s => { const track = exams.tracks.find(t => t.id === s.trackId)!; const links = exams.areaRelations.filter(r => r.conceptId === concept.id && r.verification === "verified").map(r => ({ relation: r, area: exams.areas.find(a => a.id === r.areaId)! })).filter(x => x.area.syllabusId === s.id && x.area.verification === "verified"); return <details key={s.id}><summary>{track.name} · {s.start} ~ {s.end} · {today < s.start ? "적용 전" : today > s.end ? "적용 종료" : "적용 중"}</summary><p>적용 기간: {s.start} ~ {s.end} · <a href={s.source.url}>공식 출제기준 목록 ↗</a></p><p>{s.source.scope} · 확인 {s.source.checked}</p>{links.length ? <ul>{links.map(({area, relation}) => <li key={area.id}>{area.name} · 연결 근거: {relation.reason} · 검토: {relation.review} · <a href={area.source.url}>출처 ↗</a> · {area.source.scope} · 확인 {area.source.checked}</li>)}</ul> : <p>이 버전에서 확인된 개념 연결이 없습니다. 출제 여부는 미확인입니다.</p>}</details>; })}
        <h3>관련 공식 기출문제</h3>{exams.questionRelations.filter(r => r.conceptId === concept.id && r.verification === "verified").map(r => ({ relation:r, paper:exams.papers.find(p => p.id === r.paperId)! })).filter(x => x.paper.verification === "verified").map(({relation, paper}) => <p key={paper.id}>{exams.tracks.find(t => t.id === paper.trackId)?.name} · {paper.year}년 제{paper.session}회 {paper.period && `${paper.period}교시`} {paper.question && `${paper.question}번`} · 연결 근거: {relation.reason} · 검토: {relation.review} · <a href={paper.source.url}>공식 자료 ↗</a> · {paper.location} · 확인 {paper.source.checked}</p>)}
        {!exams.questionRelations.some(r => r.conceptId === concept.id && r.verification === "verified" && exams.papers.some(p => p.id === r.paperId && p.verification === "verified")) && <p>확인된 개념별 기출문제 연결이 없습니다. 출제 여부는 미확인입니다.</p>}
        <details><summary>공식 문제지 자료실 참고</summary>{exams.papers.filter(p => p.period === undefined).map(p => <p key={p.id}><a href={p.source.url}>{exams.tracks.find(t => t.id === p.trackId)?.name} 제{p.session}회 문제지 ↗</a> · {p.source.scope} · 확인 {p.source.checked}</p>)}</details>
      </section><section className="recall"><p className="eyebrow">RECALL · 기술사 관점</p><h2>내 언어로 설명해 볼까요?</h2><p>{concept.recall.question}</p><details><summary>생각한 뒤 핵심 내용 확인하기</summary><p>{concept.recall.answer}</p></details><p className="recall-note">일반 설명 연습이며 기출문제가 아닙니다. 회상 내용은 저장되지 않습니다.</p></section>
      <ReviewForm conceptId={concept.id} /><section className="sources"><h2>출처와 검토 상태</h2><p>{({ draft: "초안", needs_review: "검토 필요", verified: "검증 완료" } as const)[concept.verification]} · AI 작성 보조: {concept.aiAssistance}</p><ul>{concept.sources.map((source) => <li key={source.url}><a href={source.url}>{source.title} ↗</a><br /><span>{source.scope} · 확인 {source.checked}</span></li>)}</ul></section></div>
      <aside className="relations"><p className="eyebrow">KEEP EXPLORING</p><h2>연결된 개념</h2>{(["prerequisite", "related", "compare"] as const).map((type) => { const items = concept.relations.filter((r) => r.type === type); return items.length ? <div className="relation-group" key={type}><h3>{labels[type]}</h3>{items.map((r) => <Link key={r.id} href={`/concepts/${r.id}`}>{concepts.find((c) => c.id === r.id)?.name}<span aria-hidden="true">→</span></Link>)}</div> : null; })}</aside></div>
    </article><footer>IT KNOWLEDGE ATLAS <span>·</span> 이해하고 연결하는 학습</footer></main>;
}
