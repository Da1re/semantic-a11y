# 다음 세션 인수인계

> 마지막 갱신: 2026-10-20(VS Code 세션). 세션이 끝날 때마다 이 파일을 최신 상태로 덮어쓴다.
> 먼저 `CLAUDE.md`(작업·코드 규칙)와 `docs/history/2026-10-20.md`를 읽는다. 설계 문서와 허브는 claude.ai 문서라 VS Code 세션에서 못 열 수 있어서, 필요한 결정은 이 파일에 옮겨 적었다.

## 1. 지금 상태

- 중간과제 마감: **2026-10-22(목) 23:59**. 제출물은 PPT + 공개 URL
- 공개 URL: https://semantic-a11y.vercel.app (main에 푸시하면 Vercel이 자동 배포). 배포별 주소(`...-da1res-projects.vercel.app`)는 Vercel 로그인으로 막혀 있으니 제출·공유에 쓰지 않는다
- GitHub: https://github.com/Da1re/semantic-a11y (개인 계정, public, MIT)
- 1단계 기능(할 일 3-1~3-8)은 2026-10-20에 main에 합쳐 푸시했고 배포까지 확인했다(배포 사이트에서 샘플 3종 숫자·수정 적용 0건 확인)
- 그 뒤 목록 화살표 키 이동과 문서 갱신을 브랜치 **`feat/list-arrow-keys-v1-dalre`**에 커밋했다. main에 합쳐 푸시하면 배포된다

### 동작하는 것

- `/playground`
  - 입력: 샘플 3종 또는 HTML 붙여넣기(정리 후 점검, AI 미연결 표시)
  - 점검: axe-core 실제 실행 + 샘플별 mock AI 판정. 결과 패널(요약, 레이어·집중 모드 토글, 리포트 언어 ko/en, 내보내기 JSON·Markdown·PDF, 위반 목록)
  - 목록 항목을 펼치면 상세(기준·심각도·출처·근거·코드 조각·수정 전/후·복사). hover·focus 강조, 선택하면 미리보기 안만 스크롤
  - 목록에서 위·아래 화살표·Home·End로 항목 사이 이동(펼친 상세는 건너뜀). 키보드 초점을 따라 미리보기도 스크롤, 마우스 hover는 스크롤하지 않음
  - "수정 코드 모두 적용하고 다시 점검" → 수정 전/후 비교(해결·남음·새로 생김) + 결과·미리보기 전환
- `/playground/review`: 신뢰도 0.7 미만 판정 3건(shop `#promo-banner`, signup `#terms-link`, notice `#app-qr`) 승인·반려(사유 필수)·되돌리기. localStorage에 저장, 플레이그라운드 목록에 배지, 반려는 내보내기에서 제외

검증된 숫자(바뀌면 회귀): shop 위반 13(규칙 3·AI 10, 핀 13), signup 11(3·8, 핀 11), notice 13(5·8, 핀 12, `title` 위반은 화면에 안 그려짐). 수정 적용 후 세 샘플 모두 0건. 플레이그라운드·검수·랜딩 자기 점검 axe 위반 0건(미리보기 iframe 제외, 붙여넣기로 점검해도 0건).

### 파일 지도 (`apps/web/src/pages/playground/`)

```
samples/          shop·signup·notice 각각 page.html, expected.json(정답), judgements.json(mock AI 출력)
                  sample-catalog.ts, sample-fixes.ts(고칠 목록·수정본 HTML), README.md(데이터 형식과 규칙)
constants/        sample, severity, judged-by, kwcag-catalog, input-source, report-view, report-locale, review-status
engine/           audit-html(진입점) → audit-frame → run-axe → to-rule-violations(+ map-to-kwcag)
                  / judge/(mock-judge, disconnected-judge) → to-ai-violations → sort-by-document
                  apply-fixes, sanitize-html(DOMPurify, 지연 로드), fingerprint, snippet, extract-candidates, types
hooks/query/      audit-query.ts(fetchAudit, fetchFixedSampleAudit) + use-audit-query(['audit','sample',id] | ['audit','html',hash])
                  + use-fixed-audit-query(['audit','sample',id,'fixed'])
hooks/            use-current-audit(보기에 맞는 결과), use-preview-source, use-overlay-rects, use-scroll-to-selected,
                  use-copy-text, use-export-report
store/            playground-store(대상·수정 적용·보기·언어·선택·레이어·집중 모드) + review-store(persist)
                  각각 context + provider + use-xxx-store
models/           audit-form, audit-target, preview-html, preview-source, overlay-box, report-status, compare-reports,
                  violation-text(언어별 제목·기준·출처), report-document → to-markdown / to-print-html, review-decision,
                  list-navigation(화살표·Home·End → 다음 위치)
components/       playground-page, input/(audit-form, source-picker, sample-picker, html-input),
                  preview/(preview-frame, preview-placeholder, overlay-layer, overlay-box, focus-scrim), progress/,
                  report/(report-panel, report-summary, layer-toggles, report-locale-toggle, review-badge, violation-list,
                  violation-item, detail/, fix/, export/), review/(review-page, review-sample-section, review-sample-items,
                  review-item, review-actions, reject-form)
```

## 2. 바꾸지 않을 결정

- AI 판정은 mock이고 화면에 그렇다고 적는다. **붙여 넣은 HTML의 AI 판정은 지어내지 않는다**("AI 미연결", AI 판정 위반 칸은 "미연결", 내보내기 요약에서도 AI 줄 제외)
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

### 3-1. 배포
- 브랜치 `feat/list-arrow-keys-v1-dalre`를 main에 합치고 푸시 → https://semantic-a11y.vercel.app 에서 목록 화살표 키 이동 확인

### 3-2. 목요일 제출 준비
- 지인 1~2명 사용 → 막힌 점 고치고 전후 캡처(수정 적용 비교 화면이 "개선 전후" 핵심 시연)
- PPT: 문제·개요 / 기능·흐름 / 화면·입출력 사례 / AI 모델 후보 / 로드맵. 근거 자료로 `samples/README.md`의 "axe가 통과시키지만 KWCAG로는 위반인 것" 표
- 제출: PPT + https://semantic-a11y.vercel.app

### 3-3. 미정·보류 (수빈 결정 필요)
- 점검 범위 표시(설계: 점검 영역 테두리, 제외 영역 빗금): 엔진에 "제외 영역" 개념이 없어 보류. 무엇을 제외할지(숨김 요소, iframe, 사용자가 고른 영역 등) 정해야 만들 수 있다
- 메인 JS 청크가 497KB로 Vite 경고 기준(500KB)에 거의 닿았다. 페이지 단위 지연 로드(`React.lazy`)는 라우터 수정이라 승인 필요

### 3-4. 기록 (코드 작업이 끝난 뒤 Cowork 세션에서 한 번에)
- 수빈 결정(2026-10-20): 코드 수정과 지인 테스트 수정을 먼저 끝내고, claude.ai 허브·설계 문서는 그 뒤 한 번에 갱신한다
- 반영할 것: 1단계 구현 완료와 배포, 결정 로그(토스트 대신 화면 안 문장, DOMPurify style 처리, AI 미연결 표시, 화살표 키), 범위 표시 보류, 다음 할 일

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
