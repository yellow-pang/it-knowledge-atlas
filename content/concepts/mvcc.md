---
{
  "id": "mvcc",
  "name": "MVCC",
  "domains": [
    "database"
  ],
  "definition": "데이터의 여러 버전과 스냅샷을 이용해 동시 접근을 관리하는 방식입니다.",
  "relations": [
    {
      "type": "prerequisite",
      "id": "transaction"
    },
    {
      "type": "related",
      "id": "isolation-level"
    },
    {
      "type": "related",
      "id": "locking"
    }
  ],
  "examAreaIds": [],
  "sources": [
    {
      "title": "PostgreSQL 18 공식 문서",
      "url": "https://www.postgresql.org/docs/18/mvcc-intro.html",
      "checked": "2026-11-01",
      "scope": "PostgreSQL의 스냅샷과 읽기·쓰기 동시성"
    }
  ],
  "verification": "needs_review",
  "aiAssistance": "AI가 초안을 작성하고 공식 문서와 대조함; 독립적인 검토는 필요"
}
---

PostgreSQL의 MVCC에서는 SQL 문이 일정 시점의 데이터 스냅샷을 봅니다. 이 방식은 동시에 변경 중인 데이터의 일관되지 않은 중간 상태를 읽지 않도록 돕습니다.

PostgreSQL에서 일반적인 읽기와 쓰기는 서로를 차단하지 않습니다. 그렇다고 모든 충돌이 사라지는 것은 아닙니다. 쓰기 간 충돌이나 특정 자원 보호에는 잠금이 필요할 수 있으며, 스냅샷의 범위는 격리 수준에 따라 다릅니다.
