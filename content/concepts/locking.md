---
{
  "id": "locking",
  "name": "잠금",
  "domains": [
    "database"
  ],
  "definition": "동시에 접근하는 작업 사이의 충돌을 제어하기 위해 자원에 적용하는 제어 방식입니다.",
  "relations": [
    {
      "type": "prerequisite",
      "id": "transaction"
    },
    {
      "type": "related",
      "id": "mvcc"
    }
  ],
  "examAreaIds": [],
  "sources": [
    {
      "title": "PostgreSQL 18 공식 문서",
      "url": "https://www.postgresql.org/docs/18/explicit-locking.html",
      "checked": "2026-11-01",
      "scope": "PostgreSQL의 명시적 잠금과 충돌"
    }
  ],
  "verification": "needs_review",
  "aiAssistance": "AI가 초안을 작성하고 공식 문서와 대조함; 독립적인 검토는 필요"
}
---

PostgreSQL은 테이블과 행 등 여러 수준의 잠금을 제공합니다. 충돌하는 잠금은 동시에 보유할 수 없으므로 한 작업이 다른 작업의 완료를 기다릴 수 있습니다. 명령이 필요한 잠금을 자동으로 얻기도 하고, 애플리케이션이 명시적으로 잠금을 요청하기도 합니다.

여러 트랜잭션이 서로 상대방이 가진 잠금을 기다리면 교착 상태가 생길 수 있습니다. PostgreSQL은 이를 감지해 한 트랜잭션을 중단하므로, 애플리케이션은 실패를 처리해야 합니다.
