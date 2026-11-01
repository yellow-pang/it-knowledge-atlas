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
        "title": "Q-Net 2027~2030 출제기준 자료실",
        "url": "https://www.q-net.or.kr/cst006.do?id=cst00601&code=1202&gSite=Q",
        "checked": "2026-11-01",
        "scope": "자료실에서 정보관리기술사 검색 → 2027~2030 기준 선택; 보고서 1~2쪽의 적용 기간, 필기 주요·세부항목"
      },
      "verification": "verified",
      "review": "2026-11-01 AI 원문 대조: Q-Net 뷰어 1쪽 적용 기간; 독립 검토 전"
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
    },
    {
      "id": "im-2027-data-processing",
      "syllabusId": "information-management-2027-2030",
      "name": "자료처리",
      "source": {
        "title": "Q-Net 2027~2030 출제기준 자료실",
        "url": "https://www.q-net.or.kr/cst006.do?id=cst00601&code=1202&gSite=Q",
        "checked": "2026-11-01",
        "scope": "자료실에서 정보관리기술사 검색 → 2027~2030 기준 선택; 보고서 1~2쪽의 적용 기간, 필기 주요·세부항목"
      },
      "verification": "verified",
      "review": "2026-11-01 AI 원문 대조: 보고서 2쪽 필기 주요항목 3; 독립 검토 전"
    },
    {
      "id": "im-2027-dbms-distributed-files",
      "syllabusId": "information-management-2027-2030",
      "parentId": "im-2027-data-processing",
      "name": "DBMS과 분산파일처리",
      "source": {
        "title": "Q-Net 2027~2030 출제기준 자료실",
        "url": "https://www.q-net.or.kr/cst006.do?id=cst00601&code=1202&gSite=Q",
        "checked": "2026-11-01",
        "scope": "자료실에서 정보관리기술사 검색 → 2027~2030 기준 선택; 보고서 1~2쪽의 적용 기간, 필기 주요·세부항목"
      },
      "verification": "verified",
      "review": "2026-11-01 AI 원문 대조: 보고서 2쪽 필기 자료처리의 세부항목 3; 독립 검토 전"
    }
  ],
  "areaRelations": [
    {
      "conceptId": "isolation-level",
      "areaId": "im-2023-dbms-distributed-files",
      "reason": "격리 수준은 DBMS의 동시 트랜잭션 처리에 관한 개념으로, 공식 세부항목 DBMS 관련 학습에 해당한다. 기준 원문이 격리 수준을 명시한 것은 아니다.",
      "verification": "verified",
      "review": "2026-11-01 AI 대조: 기준 항목과 개념 설명을 비교한 해석; 독립 검토 전"
    },
    {
      "conceptId": "isolation-level",
      "areaId": "im-2027-dbms-distributed-files",
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
        "scope": "게시물 제목과 첨부 문제지 존재; 개별 문항은 별도 항목에 기록"
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
공식 원문에서 대조한 범위와 개념 연결을 기록합니다. AI 대조 결과는 독립 검토 전입니다.
