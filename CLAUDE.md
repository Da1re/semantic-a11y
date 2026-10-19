# semantic-a11y — 작업 가이드

AI 코딩 에이전트와 사람이 이 레포에서 작업할 때 따르는 규칙이다. 결정의 배경은 아래 문서에 있다.

- 프로젝트 허브(현황·결정 로그·다음 할 일): https://claude.ai/code/artifact/8d186f8c-8c57-4749-800d-05ea9aacf9df
- 1단계 설계(플레이그라운드): https://claude.ai/code/artifact/e716fb75-8072-4768-beb6-619afa8a9ed9
- 세션 기록: `docs/history/YYYY-MM-DD.md`, 조사 노트: `docs/research/`
- **새 세션은 `docs/handoff.md`(인수인계: 현재 상태·결정·할 일)부터 읽는다**

## 프로젝트 한 줄

규칙 엔진(axe-core)이 통과시킨 접근성 항목 중 실제로는 틀린 것(대체 텍스트·링크 문구·색 의존 등)을 AI가 의미로 판정하고, KWCAG 2.2·WCAG 기준 리포트(한·영, md·pdf·json)로 알려 주는 도구.

## 현재 단계: 1단계 웹 플레이그라운드

- `apps/web`: 랜딩(`/`), 플레이그라운드(`/playground`), 검수 대기열(`/playground/review`)
- axe-core는 브라우저에서 **실제로** 실행한다. AI 판정은 `Judge` 인터페이스 뒤에서 샘플별 mock으로 시작한다.
- 사용자가 직접 붙여 넣은 HTML의 AI 판정은 지어내지 않는다. "AI 미연결"로 표시한다.
- 샘플은 모두 직접 만든 가상 페이지다. 회사 화면·데이터는 쓰지 않는다. 도메인은 `.example`.
- CLI·MCP·크롬 확장은 2단계 이후. 엔진은 `pages/playground/engine/`에서 시작해 2단계에 `packages/core`로 승격한다.

## 명령어

```bash
pnpm install
pnpm dev         # http://localhost:5173
pnpm typecheck
pnpm lint
pnpm build
```

## 작업 원칙

1. 코드는 요청받은 범위만 고친다. 범위는 요청받은 파일과 그 파일이 직접 import 하는 것까지.
2. 전역은 먼저 묻는다: `package.json`, `tsconfig`, ESLint, `vite.config`, `vercel.json`, `pnpm-workspace.yaml`, 라우터·레이아웃·전역 스타일, 공용 함수/훅/컴포넌트의 시그니처 변경, 의존성 추가·제거.
3. 라이브러리 옵션을 제안하기 전에 해당 버전 공식 문서에 실제로 있는지 확인한다.

## 코드 규칙

- **중첩 금지**: 제어문 중첩은 1단계까지(`max-depth: 1`), 중첩 삼항 금지. 조건은 위에서 선언하고 early return. 분기에 따라 값만 달라지면 값을 먼저 고른다. 분기 3개 이상이면 맵이나 별도 함수로.
- **Props drilling 금지**: 중간 컴포넌트가 쓰지 않고 넘기기만 하는 prop이 있으면 잘못 짠 것이다. 순서대로 ① 서버·비동기 데이터는 필요한 곳에서 쿼리 훅 직접 호출 ② 클라이언트 상태는 스토어 + selector ③ 폼은 `useFormContext` ④ UI는 children/slot 합성.
- **크기**: 컴포넌트·함수 본문은 목표 100줄, 상한 120줄. 넘으면 폴더를 깊게 파고 커스텀 훅·util로 나눈다.
- **컴포넌트**: `export function PascalCase()`, default export 금지(ESLint로 막음), Props는 바로 위 `interface XxxProps`, 타입은 `import type`, `any` 금지.
- **상수**: 3곳 이상 반복될 때만 상수화. 쓰는 도메인 폴더의 `constants/`에 둔다. 코드값은 `as const` + 타입 파생 + 라벨 `Record`(한·영). enum은 쓰지 않는다.
- **중복**: 3곳 이상 반복돼도 승인 없이 공통화하지 않는다. 승격을 제안만 한다.
- **주석**: 한국어로 "왜"만 쓴다.
- **커서**: 버튼은 항상 `cursor: pointer`(`index.css`의 base 레이어가 처리). 클릭되는 라디오·체크박스의 `label`에도 `cursor-pointer`를 준다.

## 상태와 데이터

- 점검 실행(입력 → 리포트)은 React Query로 다룬다. 결과를 스토어나 `useState`에 복사하지 않는다.
- 데이터 페칭은 파일 2개로 나눈다.
  - `hooks/query/xxx-query.ts`: fetcher. 순수 async, React를 모른다. 실패는 throw로 정규화하고 폴백 메시지는 한국어.
  - `hooks/query/use-xxx-query.ts`: useQuery 래퍼만(가공·select 금지).
- queryKey는 넓은 것에서 좁은 것 순서: `['audit', 'sample', sampleId]`, `['audit', 'html', hash]`. 리포트 언어는 키에 넣지 않는다(화면에서만 전환).
- 클라이언트 상태는 zustand(`createStore` + Provider 스코핑, selector로 읽기). 스토어는 `store/xxx-store.ts`, state와 action을 한 타입에, 초기값 상수 + `reset()` 제공. jotai는 쓰지 않는다.
- 폼은 react-hook-form.
- axe 결과 타입은 axe-core가 제공하는 타입(`AxeResults` 등)을 쓴다. 화면 전용 타입(폼 값, 매퍼 결과)만 `models/`에 직접 정의한다.

## 폴더 구조

기능 단위 수직 슬라이스. 새 코드는 해당 기능 폴더 안에 먼저 만든다.

```
apps/web/src/
  app/                    라우터·Provider·레이아웃 (전역)
  pages/<feature>/
    components/           UI. 하위 도메인이 생기면 폴더로 쪼갠다
    hooks/                훅. 데이터 페칭은 hooks/query/
    models/               타입·폼 값·매퍼·순수 함수
    constants/            도메인 상수
    store/                클라이언트 상태
    engine/               (playground 전용) 점검 엔진 — 2단계에 packages/core로 승격
    samples/              (playground 전용) 가상 샘플 페이지·정답·mock 판정
    index.ts              배럴 (export * from './x')
```

- 공용화는 3단계로 승격: 기능 폴더 로컬 → `<feature>/shared/` → 공용 패키지(`packages/*`).
- 파일명은 kebab-case, 컴포넌트명은 PascalCase(`detail-section.tsx` → `DetailSection`).
- `../../../`처럼 세 단계 이상 올라가는 상대경로는 `@/` 별칭으로 바꾼다.

## 접근성

이 도구는 접근성 도구다. 자기 화면부터 지킨다.

- 키보드만으로 모든 기능을 쓸 수 있어야 한다. 포커스 표시를 지우지 않는다.
- 색에만 의존해 정보를 전달하지 않는다(심각도는 색 + 텍스트/아이콘, 판정 출처는 선 모양 + 라벨).
- `eslint-plugin-jsx-a11y`를 켜 두었다. 경고를 끄지 말고 고친다.
- 배포 전 플레이그라운드로 플레이그라운드 자신을 점검해 위반 0건을 유지한다.

## 브랜치·커밋

- 브랜치: `feat/{기능}-v{n}-dalre` (`fix`, `chore`도 같은 형식)
- 설계 문서는 승인 없이 커밋하지 않는다.

## 완료 보고 전 자가 점검

`pnpm typecheck`·`pnpm lint` 실행 후, 바꾼 파일을 다시 읽고 확인한다: 제어문 중첩 0건 / 중첩 삼항 0건 / 120줄 초과 없음 / props drilling 0건 / 1~2곳짜리 상수 없음 / 전역 파일 무단 수정 없음 / 요청 범위 밖 수정 없음.

## 세션 기록

작업 세션이 끝나면 `docs/history/YYYY-MM-DD.md`에 한 일·결정·다음 할 일을 남기고, 허브 문서의 결정 로그와 다음 할 일을 갱신한다.
