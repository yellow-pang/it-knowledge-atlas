---
{
  "tracks": [
    {
      "id": "information-management",
      "name": "정보관리기술사",
      "source": {
        "title": "Q-Net 종목 정보",
        "url": "https://www.q-net.or.kr/crf005.do?gSite=Q&id=crf00503s02&jmCd=0601&jmInfoDivCcd=A0",
        "checked": "2026-11-01",
        "scope": "종목명과 출제기준 적용 기간"
      }
    }
  ],
  "syllabi": [
    {
      "id": "information-management-2023-2026",
      "trackId": "information-management",
      "start": "2023-01-01",
      "end": "2026-12-31",
      "source": {
        "title": "Q-Net 정보관리기술사 2023~2026 출제기준",
        "url": "https://www.q-net.or.kr/cst006.do?artlSeq=5210754&brdId=Q006&gSite=Q&id=cst00602",
        "checked": "2026-11-01",
        "scope": "첨부 HWP 필기 출제기준 표: 주요항목 3 자료처리 및 세부항목 3 DBMS과 분산파일처리"
      },
      "verification": "verified",
      "review": "2026-11-01 AI 원문 대조: 첨부 HWP의 적용 기간 확인; 독립 검토 전"
    },
    {
      "id": "information-management-2027-2030",
      "trackId": "information-management",
      "start": "2027-01-01",
      "end": "2030-12-31",
      "source": {
        "title": "Q-Net 출제기준 목록",
        "url": "https://www.q-net.or.kr/cst006.do?brdId=Q006&code=1202&gSite=Q&id=cst00601s01&page=1&schText=%EC%A0%95%EB%B3%B4%EA%B4%80%EB%A6%AC%EA%B8%B0%EC%88%A0%EC%82%AC&schType=T",
        "checked": "2026-11-01",
        "scope": "게시 제목의 적용 기간; 첨부 원문 세부 내용 미확인"
      },
      "verification": "needs_review"
    }
  ],
  "areas": [
    {
      "id": "im-2023-data-processing",
      "syllabusId": "information-management-2023-2026",
      "name": "자료처리",
      "source": {
        "title": "Q-Net 정보관리기술사 2023~2026 출제기준",
        "url": "https://www.q-net.or.kr/cst006.do?artlSeq=5210754&brdId=Q006&gSite=Q&id=cst00602",
        "checked": "2026-11-01",
        "scope": "첨부 HWP 필기 출제기준 표: 주요항목 3 자료처리 및 세부항목 3 DBMS과 분산파일처리"
      },
      "verification": "verified",
      "review": "2026-11-01 AI 원문 대조: 필기 주요항목 3; 독립 검토 전"
    },
    {
      "id": "im-2023-dbms-distributed-files",
      "syllabusId": "information-management-2023-2026",
      "parentId": "im-2023-data-processing",
      "name": "DBMS과 분산파일처리",
      "source": {
        "title": "Q-Net 정보관리기술사 2023~2026 출제기준",
        "url": "https://www.q-net.or.kr/cst006.do?artlSeq=5210754&brdId=Q006&gSite=Q&id=cst00602",
        "checked": "2026-11-01",
        "scope": "첨부 HWP 필기 출제기준 표: 주요항목 3 자료처리 및 세부항목 3 DBMS과 분산파일처리"
      },
      "verification": "verified",
      "review": "2026-11-01 AI 원문 대조: 필기 자료처리의 세부항목 3; 독립 검토 전"
    }
  ],
  "areaRelations": [
    {
      "conceptId": "isolation-level",
      "areaId": "im-2023-dbms-distributed-files",
      "reason": "격리 수준은 DBMS의 동시 트랜잭션 처리에 관한 개념으로, 공식 세부항목 DBMS 관련 학습에 해당한다. 기준 원문이 격리 수준을 명시한 것은 아니다.",
      "verification": "verified",
      "review": "2026-11-01 AI 대조: 기준 항목과 개념 설명을 비교한 해석; 독립 검토 전"
    }
  ],
  "papers": [
    {
      "id": "information-management-137",
      "trackId": "information-management",
      "session": 137,
      "year": 2025,
      "source": {
        "title": "Q-Net 제137회 정보관리기술사 문제지",
        "url": "https://www.q-net.or.kr/cst006.do?artlSeq=5242749&brdId=Q006&code=1203&gSite=Q&id=cst00602",
        "checked": "2026-11-01",
        "scope": "게시물 제목과 첨부 문제지 존재; 문제지 내용 미확인"
      },
      "verification": "needs_review"
    },
    {
      "id": "information-management-137-3-4",
      "trackId": "information-management",
      "session": 137,
      "year": 2025,
      "period": 3,
      "question": 4,
      "location": "첨부 PDF 파일 4쪽 (상단 3교시; 하단 인쇄 표기는 2-1)",
      "source": {
        "title": "Q-Net 제137회 정보관리기술사 문제지",
        "url": "https://www.q-net.or.kr/cst006.do?artlSeq=5242749&brdId=Q006&code=1203&gSite=Q&id=cst00602",
        "checked": "2026-11-01",
        "scope": "첨부 PDF 파일 4쪽 상단 3교시, 4번의 격리 수준과 이상 현상 확인"
      },
      "verification": "verified",
      "review": "2026-11-01 AI 원문 대조: 교시·번호·주제; 독립 검토 전"
    }
  ],
  "questionRelations": [
    {
      "conceptId": "isolation-level",
      "paperId": "information-management-137-3-4",
      "reason": "문항이 트랜잭션 격리 수준과 그 수준에 따른 이상 현상을 직접 다룬다.",
      "verification": "verified",
      "review": "2026-11-01 AI 원문과 개념 대조; 독립 검토 전"
    }
  ]
}
---
공식 게시 정보만 기록하며 첨부 문서 내용과 개별 연결은 확인 후 추가합니다.
