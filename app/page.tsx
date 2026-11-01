import Link from "next/link";
import { getConcepts } from "@/lib/concepts";

export default function Home() {
  const concepts = getConcepts();
  return <main className="shell">
    <header className="site-header"><span className="brand">IT KNOWLEDGE ATLAS</span><span className="header-note">개념 학습</span></header>
    <section className="intro"><p className="eyebrow">하루의 배움, 하나의 연결</p><h1>개념을 이해하고<br /><em>나의 언어로</em> 설명하기</h1><p>작은 개념부터 차근차근 읽고, 연결된 지식으로 넓혀 보세요.</p></section>
    <section aria-labelledby="concepts-heading"><div className="section-heading"><div><p className="eyebrow">EXPLORE</p><h2 id="concepts-heading">학습할 개념</h2></div><span>{concepts.length}개의 개념</span></div>
      <p className="section-description">데이터베이스의 트랜잭션과 동시성을 중심으로 살펴봅니다.</p>
      <div className="concept-list">{concepts.map((concept, index) => <Link className="concept-card" href={`/concepts/${concept.id}`} key={concept.id}><span className="card-number">{String(index + 1).padStart(2, "0")}</span><div>{concept.domains.map((domain) => <span className="tag" key={domain}>{domain === "database" ? "데이터베이스" : domain}</span>)}<h3>{concept.name}</h3><p>{concept.definition}</p></div><span className="arrow" aria-hidden="true">↗</span></Link>)}</div>
    </section><footer>IT KNOWLEDGE ATLAS <span>·</span> 이해하고 연결하는 학습</footer>
  </main>;
}
