# semantic-a11y

**AI semantic accessibility checker with KWCAG 2.2 & WCAG support**

규칙 엔진이 못 보는 웹 접근성 문제를 AI가 의미로 판정하는 도구입니다. axe-core가 통과시킨 항목 중 실제로는 틀린 것(대체 텍스트가 이미지와 맞지 않음, 링크 문구와 목적지 불일치, 색으로만 전달하는 정보 등)을 찾아, KWCAG 2.2 검사항목·WCAG 성공기준 리포트와 수정 코드로 알려 줍니다.

> 현재 1단계(웹 플레이그라운드) 개발 중입니다. 샘플 페이지와 수치는 모두 가상입니다.

## 플레이그라운드

브라우저에서 바로 써 볼 수 있습니다. (배포 후 링크 추가 예정)

1. 샘플 페이지를 고르거나 HTML을 붙여 넣는다
2. 규칙 점검(axe-core)이 브라우저에서 실제로 실행된다
3. AI 판정 대상을 추출하고 의미를 판정한다(1단계는 샘플별 mock 판정)
4. 위반 위치를 화면 위 오버레이로 보고, 근거·신뢰도·수정 코드를 확인한다

## 로드맵

| 단계 | 내용 | 상태 |
| --- | --- | --- |
| 1 | 웹 플레이그라운드 | 진행 중 |
| 2 | CLI (npm), 엔진을 `packages/core`로 분리 | 예정 |
| 3 | MCP 서버(AI 코딩 에이전트 연결) | 예정 |
| 4 | 크롬 확장 | 예정 |

## 개발

```bash
pnpm install
pnpm dev
pnpm typecheck && pnpm lint && pnpm build
```

- 스택: pnpm workspace, Vite, React 19, TypeScript, Tailwind CSS, React Router, TanStack Query, zustand, react-hook-form, axe-core
- 작업 규칙: [`CLAUDE.md`](./CLAUDE.md)
- 세션 기록·조사 노트: [`docs/`](./docs)

## 라이선스

MIT. 규칙 엔진으로 쓰는 [axe-core](https://github.com/dequelabs/axe-core)는 MPL-2.0이며, 수정 없이 의존성으로만 사용합니다.

**Keywords**: accessibility, a11y, KWCAG, WCAG, 웹 접근성, AI, MCP
