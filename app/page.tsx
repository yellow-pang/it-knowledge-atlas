import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getConcepts, type Concept } from "@/lib/concepts";
import { getStates, type State } from "@/lib/progress";
import { seoulDate } from "@/lib/review";

export const dynamic = "force-dynamic";
function Cards({ concepts, dates }: { concepts: Concept[]; dates?: Map<string, string> }) {
  return <div className="concept-list">{concepts.map((concept, index) => <Link className="concept-card" href={`/concepts/${concept.id}`} key={concept.id}><span className="card-number">{String(index + 1).padStart(2, "0")}</span><div>{concept.domains.map((domain) => <span className="tag" key={domain}>{domain === "database" ? "데이터베이스" : domain}</span>)}<h3>{concept.name}</h3><p>{concept.definition}</p>{dates?.has(concept.id) && <p>복습 예정일: {dates.get(concept.id)}</p>}</div><span className="arrow" aria-hidden="true">↗</span></Link>)}</div>;
}
export default async function Home() {
  await requireAuth();
  const concepts = getConcepts().sort((a, b) => a.id.localeCompare(b.id, "en"));
  let states: State[];
  try { states = await getStates(); } catch {
    return <main className="shell"><header className="site-header"><span className="brand">IT KNOWLEDGE ATLAS</span></header><section className="intro"><h1>학습 기록을 불러오지 못했습니다</h1><p>데이터베이스 연결을 확인한 뒤 새로고침해 주세요. 개념은 아래에서 계속 읽을 수 있습니다.</p></section><Cards concepts={concepts} /></main>;
  }
  const today = seoulDate(new Date());
  const stateMap = new Map(states.map((state) => [state.concept_id, state]));
  const due = concepts.filter((c) => { const state = stateMap.get(c.id); return state && state.next_review_date <= today; }).sort((a, b) => stateMap.get(a.id)!.next_review_date.localeCompare(stateMap.get(b.id)!.next_review_date) || a.id.localeCompare(b.id));
  const fresh = concepts.filter((c) => !stateMap.has(c.id));
  const started = concepts.length - fresh.length;
  const domains = [...new Set(concepts.flatMap((c) => c.domains))].sort();
  return <main className="shell"><header className="site-header"><span className="brand">IT KNOWLEDGE ATLAS</span><form action="/api/auth/logout" method="post"><button type="submit">로그아웃</button></form></header>
    <section className="intro"><p className="eyebrow">하루의 배움, 하나의 연결</p><h1>오늘도 <em>나의 언어로</em><br />설명해 볼까요?</h1><p>복습하거나 새 개념을 골라 읽고 핵심 내용을 떠올려 보세요. 학습량은 자유롭게 정할 수 있습니다.</p></section>
    <section className="home-section"><div className="section-heading"><div><p className="eyebrow">REVIEW · {today}</p><h2>오늘의 복습</h2></div><span>{due.length}개</span></div><p className="section-description">오늘 또는 이전에 복습하기로 한 개념입니다.</p>{due.length ? <Cards concepts={due} dates={new Map(states.map((s) => [s.concept_id, s.next_review_date]))} /> : <p className="empty">오늘 복습할 개념이 없습니다. 새 개념을 살펴보세요.</p>}</section>
    <section className="home-section"><div className="section-heading"><div><p className="eyebrow">NEW</p><h2>새로운 학습</h2></div><span>{fresh.length}개</span></div><p className="section-description">아직 평가하지 않은 개념을 ID 순서로 표시합니다.</p>{fresh.length ? <Cards concepts={fresh} /> : <p className="empty">새 개념을 모두 시작했습니다. 아래 전체 개념에서 다시 학습할 수 있습니다.</p>}</section>
    <section className="home-section"><div className="section-heading"><div><p className="eyebrow">PROGRESS</p><h2>학습 현황</h2></div></div><p className="section-description">전체 {concepts.length}개 · 학습 시작 {started}개 · 미학습 {fresh.length}개 · 복습 필요 {due.length}개</p><ul className="progress-list">{domains.map((domain) => { const items = concepts.filter((c) => c.domains.includes(domain)); return <li key={domain}>{domain === "database" ? "데이터베이스" : domain}: {items.filter((c) => stateMap.has(c.id)).length} / {items.length}개 학습 시작</li>; })}</ul><p className="section-description">한 개념이 여러 분야에 속할 수 있어 분야별 합계는 전체 개념 수와 다를 수 있습니다.</p></section>
    <section className="home-section"><div className="section-heading"><div><p className="eyebrow">EXPLORE</p><h2>전체 개념</h2></div></div><p className="section-description">언제든 개념을 다시 읽고 평가할 수 있습니다.</p><Cards concepts={concepts} /></section><footer>IT KNOWLEDGE ATLAS <span>·</span> 이해하고 연결하는 학습</footer></main>;
}
