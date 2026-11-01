---
{
  "id": "transaction",
  "name": "트랜잭션",
  "domains": [
    "database"
  ],
  "definition": "여러 데이터베이스 작업을 하나의 원자적인 작업 단위로 묶는 개념입니다.",
  "relations": [
    {
      "type": "related",
      "id": "acid"
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
      "scope": "트랜잭션의 원자성, 커밋과 롤백"
    }
  ],
  "verification": "needs_review",
  "aiAssistance": "AI가 초안을 작성하고 공식 문서와 대조함; 독립적인 검토는 필요"
}
---

계좌 이체처럼 여러 변경이 함께 성공해야 하는 작업을 트랜잭션으로 묶을 수 있습니다. 중간에 실패하면 롤백하여 해당 트랜잭션의 변경을 취소하고, 성공하면 커밋하여 결과를 확정합니다.

PostgreSQL에서는 명시적 트랜잭션 블록을 BEGIN으로 시작하고 COMMIT 또는 ROLLBACK으로 끝냅니다. 동시 작업에서 다른 트랜잭션에 무엇이 보이는지는 격리 수준에 따라 살펴봐야 합니다.
