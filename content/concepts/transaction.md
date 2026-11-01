---
{
  "id": "transaction",
  "name": "트랜잭션",
  "domains": [
    "database"
  ],
  "definition": "하나 이상의 데이터베이스 작업을 원자적으로 처리하는 논리적 작업 단위입니다.",
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
  "aiAssistance": "AI가 초안을 작성하고 공식 문서와 대조함; 독립적인 검토는 필요",
  "summary": "여러 변경을 하나의 단위로 묶어 성공하면 커밋하고 실패하면 롤백합니다.",
  "recall": {
    "question": "계좌 이체에서 어떤 작업을 묶고 실패 시 어떻게 처리할까요? 키워드와 설명 목차를 떠올려 보세요.",
    "answer": "작업 단위 → 출금·입금 → 커밋 또는 롤백 → 동시 접근 시 격리 수준"
  }
}
---

계좌 이체처럼 여러 변경이 함께 성공해야 하는 작업을 트랜잭션으로 묶을 수 있습니다. 중간에 실패하면 롤백하여 해당 트랜잭션의 변경을 취소하고, 성공하면 커밋하여 결과를 확정합니다.

PostgreSQL에서는 명시적 트랜잭션 블록을 BEGIN으로 시작하고 COMMIT 또는 ROLLBACK으로 끝냅니다. 동시 작업에서 다른 트랜잭션에 무엇이 보이는지는 격리 수준에 따라 살펴봐야 합니다.

PostgreSQL에서는 명시적인 블록이 없어도 각 SQL 문이 트랜잭션 안에서 실행됩니다. 여러 문을 함께 처리해야 할 때는 명시적으로 하나의 트랜잭션으로 묶습니다.

실무에서는 결제와 같은 외부 시스템 호출까지 데이터베이스 롤백이 자동으로 되돌려 준다고 가정하면 안 됩니다. 외부 작업의 실패와 재처리는 별도로 설계해야 합니다.
