---
{
  "id": "isolation-level",
  "name": "트랜잭션 격리 수준",
  "domains": [
    "database"
  ],
  "definition": "동시 트랜잭션 사이에서 허용되는 관찰 결과와 이상 현상을 구분하는 수준입니다.",
  "relations": [
    {
      "type": "prerequisite",
      "id": "transaction"
    },
    {
      "type": "related",
      "id": "mvcc"
    },
    {
      "type": "related",
      "id": "acid"
    }
  ],
  "examAreaIds": [],
  "sources": [
    {
      "title": "PostgreSQL 18 공식 문서",
      "url": "https://www.postgresql.org/docs/18/transaction-iso.html",
      "checked": "2026-11-01",
      "scope": "SQL 격리 수준과 PostgreSQL의 구현"
    }
  ],
  "verification": "needs_review",
  "aiAssistance": "AI가 초안을 작성하고 공식 문서와 대조함; 독립적인 검토는 필요"
}
---

SQL 표준은 Read Uncommitted, Read Committed, Repeatable Read, Serializable의 네 수준을 정의합니다. 수준을 이해할 때는 미확정 변경을 읽는 더티 읽기, 같은 행을 다시 읽었을 때 값이 달라지는 현상 등을 함께 살펴봅니다.

PostgreSQL의 기본값은 Read Committed입니다. Serializable은 성공적으로 커밋된 동시 실행 결과가 어떤 직렬 실행 순서와 일치하도록 보장하지만, 직렬화 실패가 발생하면 애플리케이션에서 트랜잭션을 재시도해야 할 수 있습니다. 구체적인 동작은 DBMS마다 확인해야 합니다.
