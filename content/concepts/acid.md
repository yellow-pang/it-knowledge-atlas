---
{
  "id": "acid",
  "name": "ACID",
  "domains": [
    "database"
  ],
  "definition": "트랜잭션 처리에서 살펴보는 원자성, 일관성, 격리성, 지속성의 네 가지 속성입니다.",
  "relations": [
    {
      "type": "prerequisite",
      "id": "transaction"
    },
    {
      "type": "related",
      "id": "isolation-level"
    }
  ],
  "examAreaIds": [],
  "sources": [
    {
      "title": "PostgreSQL 18 공식 문서",
      "url": "https://www.postgresql.org/docs/18/tutorial-transactions.html",
      "checked": "2026-11-01",
      "scope": "원자성, 격리, 지속성과 트랜잭션 예시"
    },
    {
      "title": "PostgreSQL 18 — 무결성 제약 조건",
      "url": "https://www.postgresql.org/docs/18/ddl-constraints.html",
      "checked": "2026-11-01",
      "scope": "무결성 제약 조건"
    }
  ],
  "verification": "needs_review",
  "aiAssistance": "AI가 초안을 작성하고 공식 문서와 대조함; 독립적인 검토는 필요"
}
---

원자성은 작업이 모두 반영되거나 모두 취소되는 성질입니다. 일관성은 트랜잭션이 정의된 무결성 규칙을 지키는 상태에서 다른 유효한 상태로 데이터베이스를 옮기는 관점입니다.

격리성은 동시 실행의 영향을 제어하는 성질이고, 지속성은 완료가 확인된 결과가 장애 후에도 유지되어야 한다는 성질입니다. 격리 수준에 따라 허용되는 동시성 현상은 다르며, 일관성은 데이터베이스 제약뿐 아니라 애플리케이션의 올바른 작업 설계에도 의존합니다.
