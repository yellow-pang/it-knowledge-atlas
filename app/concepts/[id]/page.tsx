import Link from "next/link";
import { notFound } from "next/navigation";
import { getConcepts } from "@/lib/concepts";

export function generateStaticParams() { return getConcepts().map(({ id }) => ({ id })); }
export default async function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concepts = getConcepts();
  const concept = concepts.find((item) => item.id === id);
  if (!concept) notFound();
  const labels = { prerequisite: "먼저 알아두면 좋아요", related: "함께 알아보기", compare: "비교해 보기" } as const;
  return <main className="shell detail-shell"><header className="site-header"><Link className="brand" href="/">IT KNOWLEDGE ATLAS</Link><Link className="back" href="/">← 개념 목록</Link></header>
    <article><div className="detail-title">{concept.domains.map((domain) => <span className="tag" key={domain}>{domain === "database" ? "데이터베이스" : domain}</span>)}<h1>{concept.name}</h1><p className="definition">{concept.definition}</p></div>
      <div className="detail-grid"><div><section className="reading"><p className="eyebrow">UNDERSTAND</p><h2>개념 이해하기</h2>{concept.body.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph.replace(/\n/g, " ")}</p>)}</section>
      <section className="recall"><p className="eyebrow">RECALL · 기술사 관점</p><h2>내 언어로 설명해 볼까요?</h2><p>핵심 키워드 3개 또는 설명 목차를 떠올린 뒤, 이 개념의 의미와 필요한 이유를 소리 내어 설명해 보세요.</p><p className="recall-note">일반 설명 연습이며 기출문제가 아닙니다. 확인된 시험 영역과 문제는 아직 연결되지 않았습니다.</p></section>
      <section className="sources"><h2>출처와 검토 상태</h2><p>{({ draft: "초안", needs_review: "검토 필요", verified: "검증 완료" } as const)[concept.verification]} · AI 작성 보조: {concept.aiAssistance}</p><ul>{concept.sources.map((source) => <li key={source.url}><a href={source.url}>{source.title} ↗</a><br /><span>{source.scope} · 확인 {source.checked}</span></li>)}</ul></section></div>
      <aside className="relations"><p className="eyebrow">KEEP EXPLORING</p><h2>연결된 개념</h2>{(["prerequisite", "related", "compare"] as const).map((type) => { const items = concept.relations.filter((r) => r.type === type); return items.length ? <div className="relation-group" key={type}><h3>{labels[type]}</h3>{items.map((r) => <Link key={r.id} href={`/concepts/${r.id}`}>{concepts.find((c) => c.id === r.id)?.name}<span aria-hidden="true">→</span></Link>)}</div> : null; })}</aside></div>
    </article><footer>IT KNOWLEDGE ATLAS <span>·</span> 이해하고 연결하는 학습</footer></main>;
}
