# 다음 세션 인수인계

> 마지막 갱신: 2026-10-22(Cowork 세션). 세션이 끝날 때마다 이 파일을 최신 상태로 덮어쓴다.
> 먼저 `CLAUDE.md`(작업·코드 규칙)와 `docs/history/2026-10-22.md`(그 전날 `2026-10-21.md`)를 읽는다. 설계 문서와 허브는 claude.ai 문서라 VS Code 세션에서 못 열 수 있어서, 필요한 결정은 이 파일에 옮겨 적었다.

## 1. 지금 상태

- 중간과제 마감: **2026-10-22(목) 23:59**. 제출물은 PPT + 공개 URL
- 공개 URL: https://semantic-a11y.vercel.app (main에 푸시하면 Vercel이 자동 배포). 배포별 주소(`...-da1res-projects.vercel.app`)는 Vercel 로그인으로 막혀 있으니 제출·공유에 쓰지 않는다
- GitHub: https://github.com/Da1re/semantic-a11y (개인 계정, public, MIT)
- 1단계 기능과 목록 화살표 키 이동은 main(54aa383)에 있고 배포되어 있다
- 2026-10-21~22: 실제 모델 판정을 붙였다. 최종 방향(10/22 수빈 결정)은 **각자 자기 AI로 판정**: "내 AI로 판정"(요청 복사 → 내 AI(Claude 앱 등)에 붙여 넣기 → 받은 JSON 붙여 넣기 → 같은 검증기·정답표로 채점, 키·결제 없음)이 기본이고, Claude API 키 붙여넣기는 개발자용 선택지로 남겼다. OpenRouter 연결은 방향이 아니라서 코드에서 지웠다. 나중에는 MCP 서버로 붙여 넣기를 자동화한다. 모두 수빈 맥의 레포 작업 트리에 커밋하지 않은 변경으로 들어가 있다. 브랜치 `feat/byok-judge-v1-dalre`에 커밋해 main에 합쳐야 배포된다
- 허브·설계 문서 갱신(옛 3-4)은 2026-10-20 VS Code 세션에서 끝났다
- PPT는 claude.ai Slides, 과제 설명서형(머리글·쪽 번호·개조식, PDF 제출). "각자 자기 AI로 판정" 방향으로 고쳤다

### 동작하는 것

- `/playground`
  - AI 판정 줄(선택): 평소 한 줄로 접혀 있고 [내 AI로 판정](이미지 사용 여부만 고름) 또는 [Claude API 키 입력](기본 `claude-sonnet-5-5`). 켜지면 [설정]과 [끄기]/[연결 끊기]
  - 내 AI로 판정: 점검하면 AI 판정 위반 칸이 "답 대기"이고 결과 패널 맨 위에 "내 AI로 판정"(요청 복사, 후보 이미지를 번호 붙여 한 장으로 내려받기, 답 붙여 넣기). 답을 반영하면 정답 대비까지 나오고 패널은 접힌다. 읽을 수 없는 답은 보내기 전에 입력칸 아래에서 막는다
  - 입력: 샘플 3종 또는 HTML 붙여넣기(정리 후 점검, AI를 연결하지 않으면 AI 미연결 표시)
  - 점검: axe-core 실제 실행 + 샘플별 mock AI 판정(연결 시 실제 모델). 결과 패널에 AI 판정 정보(모델·토큰·제외 건수)와 정답 대비(샘플만). 결과 패널(요약, 레이어·집중 모드 토글, 리포트 언어 ko/en, 내보내기 JSON·Markdown·PDF, 위반 목록)
  - 목록 항목을 펼치면 상세(기준·심각도·출처·근거·코드 조각·수정 전/후·복사). hover·focus 강조, 선택하면 미리보기 안만 스크롤
  - 목록에서 위·아래 화살표·Home·End로 항목 사이 이동(펼친 상세는 건너뜀). 키보드 초점을 따라 미리보기도 스크롤, 마우스 hover는 스크롤하지 않음
  - "수정 코드 모두 적용하고 다시 점검" → 수정 전/후 비교(해결·남음·새로 생김) + 결과·미리보기 전환
- `/playground/review`: 신뢰도 0.7 미만 판정 3건(shop `#promo-banner`, signup `#terms-link`, notice `#app-qr`) 승인·반려(사유 필수)·되돌리기. localStorage에 저장, 플레이그라운드 목록에 배지, 반려는 내보내기에서 제외

검증된 숫자(바뀌면 회귀, mock 기준): shop 위반 14(규칙 3·AI 11), signup 12(3·9), notice 13(5·8, `title` 위반은 화면에 안 그려짐). 10/22에 shop·signup 정답표에 6.4.1(본문 바로가기 없음, `html > body > header`)을 더했다(실제 모델이 찾아서). 수정 적용 후 세 샘플 모두 0건. 플레이그라운드·검수·랜딩 자기 점검 axe 위반 0건(미리보기 iframe 제외, 붙여넣기로 점검해도 0건).

### 파일 지도 (`apps/web/src/pages/playground/`)

```
samples/          shop·signup·notice 각각 page.html, expected.json(정답), judgements.json(mock AI 출력)
                  sample-catalog.ts, sample-fixes.ts(고칠 목록·수정본 HTML), README.md(데이터 형식과 규칙)
constants/        sample, severity, judged-by, kwcag-catalog, input-source, report-view, report-locale, review-status
engine/           audit-html(진입점) → audit-frame → run-axe → to-rule-violations(+ map-to-kwcag)
                  / judge/(mock-judge, disconnected-judge, llm-judge, manual/manual-judge) → to-ai-violations → sort-by-document
engine/judge/     rubric.md(기준서), candidate-input·unique-selector·page-context·judge-request(모델 입력),
                  candidate-images(PNG 첨부), judge-schema, validate-judge-output·judge-output-guards, prompt, llm-error,
                  llm-payload(보낼 내용 만들기·답 검증, API와 내 AI가 같이 씀), providers/(provider, anthropic, openai — openai는 웹에서 안 씀),
                  manual/(manual-judge, manual-prompt(채팅용 요청 글), parse-manual-response, image-sheet(이미지 한 장으로 묶기))
                  apply-fixes, sanitize-html(DOMPurify, 지연 로드), fingerprint, snippet, extract-candidates, types
hooks/query/      audit-query.ts(fetchAudit(target, connection), fetchFixedSampleAudit)
                  + use-audit-query(['audit','sample',id] | ['audit','html',hash], AI 판정 시 뒤에 'llm', provider, model, vision|text, 'request'|답 해시)
                  + use-fixed-audit-query(['audit','sample',id,'fixed'])
hooks/            use-current-audit(보기에 맞는 결과), use-preview-source, use-overlay-rects, use-scroll-to-selected,
                  use-copy-text, use-export-report, use-ai-connection-actions, use-restore-ai-connection, use-image-sheet-download
store/            playground-store(대상·수정 적용·보기·언어·선택·레이어·집중 모드) + review-store(persist)
                  + ai-connection-store(API 키 포함, 메모리) — 각각 context + provider + use-xxx-store
                  connection-vault·vault-key(AES-GCM 암호화 기억)
models/           audit-form, audit-target, preview-html, preview-source, overlay-box, report-status, compare-reports,
                  violation-text(언어별 제목·기준·출처), report-document → to-markdown / to-print-html, review-decision,
                  list-navigation(화살표·Home·End → 다음 위치), ai-connection(폼 값·LlmTarget), evaluate-judgements(정답 대비), judge-mode
components/       playground-page, ai/(ai-connection-panel·actions·summary·form(Claude 키)·ai-settings-form, fields/, manual/, summary/), input/(audit-form, source-picker, sample-picker, html-input),
                  preview/(preview-frame, preview-placeholder, overlay-layer, overlay-box, focus-scrim), progress/,
                  report/(report-panel, report-summary, layer-toggles, report-locale-toggle, review-badge, violation-list,
                  violation-item, judge-meta-note, accuracy/, detail/, fix/, export/, manual/), review/(review-page, review-sample-section, review-sample-items,
                  review-item, review-actions, reject-form)
```

## 2. 바꾸지 않을 결정

- AI를 연결하지 않으면 AI 판정은 mock이고 화면에 그렇다고 적는다. **붙여 넣은 HTML의 AI 판정은 지어내지 않는다**("AI 미연결", AI 판정 위반 칸은 "미연결", 내보내기 요약에서도 AI 줄 제외). PPT에서도 mock 고지를 빼지 않는다
- BYOK(2026-10-21): API 키는 queryKey·내보내기·콘솔·오류 문구에 넣지 않는다. 점검 대상에는 제공자·모델·이미지 여부만 묶는다. 키 기억은 선택이고 암호화(IndexedDB의 추출 불가 AES-GCM 키 + sessionStorage 암호문)
- **판정은 각자 자기 AI로**(10/22 수빈 결정). 웹은 "내 AI로 판정"(복사·붙여넣기, 구독만으로 됨)이 기본, Claude API 키는 선택지. OpenRouter는 쓰지 않는다(크레딧 결제가 필요해 방향이 아님). 다음 단계는 MCP 서버로 같은 흐름을 자동화
- Anthropic은 외부 앱용 OAuth가 없고 구독 로그인의 외부 사용을 금지했다. OpenAI 직접 호출은 브라우저 POST가 CORS로 막혀(10/21 확인) CLI용으로 남긴다
- 내 AI 요청은 API와 같은 기준서·후보·스키마를 글로 묶고, 이미지는 번호를 붙여 한 장으로 묶는다. 답은 처음 `{`부터 마지막 `}`까지만 읽고 같은 검증기를 거친다. 내 AI의 모델·토큰은 알 수 없어 화면에 적지 않는다
- 모델 응답은 검증기를 통과한 것만 리포트에 넣는다. 스키마는 null 합집합 없이 `severity: 'none'`·빈 `fix`로 받는다
- AI 점검 쿼리는 `retry`·`retryOnMount`·`refetchOnWindowFocus`·`refetchOnReconnect`를 모두 끈다(실패한 쿼리는 데이터가 없어 늘 stale이라, 켜 두면 오류 화면이 다시 그려질 때마다 과금 호출). 다시 시도는 버튼, 점검하기를 다시 누르면 실패한 쿼리만 비우고 돈다
- 이미지 전송을 끄면 5.1.1 판정 신뢰도를 0.69로 낮춰 사람 확인으로 보낸다
- 회사(Saycore) 화면·데이터는 쓰지 않는다. 샘플 도메인은 `.example`
- 샘플 `fix.before`는 page.html에 정확히 한 번 나오는 문자열. 모든 수정을 적용하면 axe 위반 0건(`samples/README.md`)
- 지문 = FNV-1a(sourceKey + KWCAG(없으면 rule id) + selector), sourceKey = `sample:<id>` 또는 `html:<hash>`. 수정본 재점검도 같은 sourceKey라 비교가 된다
- 오버레이는 미리보기 iframe 문서 안에 포털로 그린다. iframe은 `sandbox="allow-same-origin"`
- 심각도 색: 치명 red-700 / 심각 orange-700 / 보통 sky-700. 출처는 선·핀 모양으로도 구분
- axe 태그: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice. KWCAG 매핑 예외는 button-name·input-button-name → 5.1.1, label·select-name → 7.3.2
- 리포트 언어는 queryKey에 넣지 않는다. 바뀌는 것은 근거·항목 제목·심각도·출처 라벨, UI 문구는 한국어
- 펼침 상태 = 스토어 `selected`(선택 = 펼침 = 미리보기 스크롤)
- 붙여 넣은 HTML 정리: DOMParser → `on*` 이름 변경 → style 글자 `<` 뒤 공백 → DOMPurify(`WHOLE_DOCUMENT`, `ADD_TAGS: ['title']`, `SAFE_FOR_XML`은 끄지 않는다) → doctype
- 검수 결정 저장 키 `semantic-a11y:review`(version 1). 플레이그라운드·검수 페이지가 각자 Provider를 두고 같은 키를 쓴다(라우터는 그대로)
- **이 프로젝트는 토스트 대신 화면 안 문장**(2026-10-20 수빈 결정, CLAUDE.md 코드 규칙에도 적음). 점검 실패는 결과 패널, 복사 결과는 버튼 옆, 팝업 차단은 내보내기 영역, 입력 오류는 입력칸 아래
- 목록 키보드 이동은 W3C APG 아코디언 패턴의 선택 키를 따른다. 끝에서 반대쪽으로 돌아가지 않는다. Tab 순서는 그대로 둔다(roving tabindex 아님)

## 3. 할 일 (순서대로)

### 3-1. 커밋·배포 (제출 전에 꼭)
- 수빈 맥의 작업 트리 변경을 `feat/byok-judge-v1-dalre`에 커밋 → main에 합쳐 푸시 → https://semantic-a11y.vercel.app/playground 맨 위에 "AI 판정" 줄과 [내 AI로 판정]이 보이는지 확인
- 배포 주소에서 수빈의 Claude 앱으로 "내 AI로 판정"을 한 번 끝까지 해 보기(10/22에는 Claude 에이전트가 같은 요청·이미지로 답한 것을 붙여 넣어 확인했다)

### 3-1b. 다음 단계: MCP 서버
- 같은 흐름(요청 만들기 → 사용자의 AI가 판정 → 검증·채점)을 MCP 도구로 열어, Claude 앱·Claude Code가 붙여 넣기 없이 부르게 한다. 엔진을 `packages/core`로 옮기는 일이 먼저

### 3-2. 목요일 제출
- PPT를 PDF로 내보내기(PPTX는 IBM Plex Sans KR이 없는 컴퓨터에서 글꼴이 바뀐다)
- 제출: PPT(PDF) + https://semantic-a11y.vercel.app

### 3-3. 미정·보류 (수빈 결정 필요)
- 점검 범위 표시(설계: 점검 영역 테두리, 제외 영역 빗금): 엔진에 "제외 영역" 개념이 없어 보류
- 메인 JS 청크가 535KB로 Vite 500KB 경고에 걸린다(BYOK·내 AI 화면·정답 라벨 추가). 페이지 단위 지연 로드(`React.lazy`)는 라우터 수정이라 승인 필요
- `use-fixed-audit-query`도 실패하면 오류 화면이 다시 그려질 때마다 재점검한다(mock이라 비용은 없음). 같은 옵션을 넣을지
- 후보 40개 넘으면 나눠 보내기, 같은 템플릿 한 번만 보내기(설계의 토큰 절약 항목)는 다음 단계
- npm 이름 `semantic-a11y`, `@semantic-a11y/core·cli·mcp`는 10/21 기준 비어 있다. 쓰려면 npm에서 scope(조직)를 먼저 만든다

## 4. 함정 메모

- eslint-plugin-react-hooks v7(recommended-latest)은 effect 안에서 setState를 바로 부르면 경고한다. 위치 계산은 ResizeObserver의 첫 콜백으로 처리했다
- `useQuery`를 끌 때는 `enabled` 대신 `skipToken`을 쓴다(TanStack Query 5)
- axe-core는 `exports` 필드가 없어서 `axe-core/axe.min.js?raw`, `axe-core/locales/ko.json`을 그대로 import할 수 있다. axe 청크(약 650KB)는 점검할 때만 불러온다. 빌드 때 500KB 경고는 이것 때문
- axe 한국어 로케일에 없는 규칙(target-size 등)은 근거가 영어로 나온다
- 미리보기 iframe은 스크립트가 막혀 있어서 인라인 핸들러를 `data-sa11y-on*`로 바꿔 넣는다
- `title`처럼 화면에 안 그려지는 요소는 크기가 0이라 오버레이를 건너뛴다
- DOMPurify 3.4는 `<title>`을 기본으로 지우고, `SAFE_FOR_XML`이 "<영문자"가 든 `<style>`을 지운다(위 정리 순서 참고)
- RHF 7.90의 `validate(value, formValues)`로 입력 방식이 HTML일 때만 textarea를 검사한다(숨은 필드 검증 방지)
- 브라우저 확인은 Chrome 자동 조작(playwright-core, 임시 폴더 설치)으로 했다. 프로젝트 의존성에는 넣지 않았다
- 전역 파일(설정, 라우터, 레이아웃, 전역 스타일, 의존성)은 고치기 전에 수빈에게 묻는다
- Anthropic 구조화 출력은 이제 `output_config.format`(베타 헤더 불필요). 스키마에 `minimum`·`maximum`을 못 쓰고, null 합집합 수에 상한이 있다
- 브라우저에서 Anthropic을 부를 때는 `anthropic-dangerous-direct-browser-access: true` 헤더가 있어야 CORS가 열린다
- 제공자는 SVG 이미지를 받지 않는다. 샘플의 SVG data URI는 캔버스로 PNG로 다시 그려 보낸다(다른 출처 이미지는 캔버스가 오염돼 "이미지 없음"으로 판정)
- 제공자 호출 테스트는 Playwright `page.route`로 가짜 응답을 돌려줘 과금 없이 했다
