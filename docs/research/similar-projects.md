# 유사 프로젝트 조사 (2026-10-06)

| 프로젝트 | 형태 | KWCAG | AI 의미 판정 | 비고 |
| --- | --- | --- | --- | --- |
| [IsaacEryn/a11ychk](https://github.com/IsaacEryn/a11ychk) | 웹·크롬 확장(MV3)·GitHub Action·MCP | 있음(33항목, 표준 번호) | 없음 | Apache-2.0(엔진·MCP·확장) / AGPL-3.0(웹), 스타 3 |
| [ronantakizawa/a11ymcp](https://github.com/ronantakizawa/a11ymcp) | MCP(axe + Puppeteer) | 없음 | 없음 | MIT, 스타 89 |
| [priyankark/a11y-mcp](https://github.com/priyankark/a11y-mcp) | MCP(axe) | 없음 | 없음 | 에이전트가 수정 |
| [Deque Axe MCP Server](https://github.com/dequelabs/axe-mcp-server-public) | MCP(analyze, remediate) | 없음 | 수정 가이드만 | 유료 axe DevTools 구독 필요 |
| [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) | MCP | 없음 | 없음 | lighthouse_audit, a11y 트리 스냅샷 |
| [github/accessibility-scanner-alt-text-plugin](https://github.com/github/accessibility-scanner-alt-text-plugin) | 스캐너 플러그인 | 없음 | alt만 LLM 판정(기본 꺼짐) | MIT |

## a11ychk 소스에서 확인한 것

- 의존성: core(axe-core, playwright-core, jsdom, parse5), mcp(@modelcontextprotocol/sdk, zod), extension(axe-core). LLM SDK 없음.
- `packages/core/src/scanner/collectSignals.ts`
  - GENERIC_ALT: `^(이미지|사진|그림|아이콘|배너|image|img|photo|picture|graphic|icon|banner|untitled|spacer|\*|-)$`
  - GENERIC_LINK: `^(여기|여기를?\s*클릭|클릭(하세요)?|더\s*보기|더보기|자세히(\s*보기)?|바로\s*가기|바로가기|here|click\s*here|click|more|read\s*more|learn\s*more|go|link)$`
- `packages/core/src/catalog/kwcag.ts`: 33항목에 ksNo(표준 번호), serial(품질인증 일련번호 1~33), autoCoverage(full/partial/none), howToTest(수동 점검 안내) 정의.
  - 대체 텍스트(5.1.1), 색에 무관한 인식(5.4.1), 적절한 링크 텍스트(6.4.3) 모두 partial → 사람 판단 영역
- "AI" 기능 = 결과를 Markdown·JSON "AI 수정 요청 문서"로 내보내기.

## 우리가 노릴 자리
정규식이 통과시킨 것 중 실제로는 틀린 것을 이미지·문맥을 보고 잡는 것.
예: 매출 차트 이미지에 alt="빨간 원피스", "공지사항" 링크가 실제로는 FAQ로 이동.
