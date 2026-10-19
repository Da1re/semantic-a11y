# 샘플 페이지

플레이그라운드 시연과 판정 성능 측정에 쓰는 가상 페이지 3종이다. 회사 화면·데이터는 쓰지 않고, 도메인은 모두 `.example`이다.

| id | 페이지 | 규칙(axe) 위반 | AI 판정 | 사람 확인 대상 |
| --- | --- | --- | --- | --- |
| `shop` | shop.example 상품 상세 | 3 | 실패 10 · 정상 3 | `#promo-banner` |
| `signup` | trip.example 회원가입 | 3 | 실패 8 · 정상 1 | `#terms-link` |
| `notice` | city.example 공지·통계 | 5 | 실패 8 · 정상 2 | `#app-qr` |

## 파일

```
<id>/
  page.html         점검 대상. 스타일 포함, 이미지는 SVG data URI
  expected.json     정답 라벨. 성능 측정용이라 화면에 그대로 보여 주지 않는다
  judgements.json   mock AI 출력. judgements(의미 판정) + ruleFixes(규칙 위반 수정 제안)
```

### expected.json

```json
{ "id": "shop-01", "selector": "#cart-button", "kwcag": "5.1.1",
  "judgedBy": "rule", "rule": "button-name", "answer": "fail", "note": "..." }
```

- `judgedBy`: 이 항목을 잡아야 하는 쪽. `rule`이면 `rule`에 axe 규칙 id가 있다.
- `answer`: `fail`(위반) 또는 `pass`(정상 요소. 오탐 확인용).

### judgements.json

```json
{
  "judgements": [
    { "selector": "#product-hero-img", "kwcag": "5.1.1", "verdict": "fail", "confidence": 0.93,
      "severity": "serious", "reason": { "ko": "...", "en": "..." }, "fix": { "before": "...", "after": "..." } }
  ],
  "ruleFixes": [
    { "selector": "#cart-button", "rule": "button-name", "fix": { "before": "...", "after": "..." } }
  ]
}
```

- 판정은 `selector + kwcag`로 정답과 연결한다. 한 요소에 판정이 둘일 수 있다(`#briefing-video`의 5.4.2, 5.2.1).
- `confidence`가 0.7 미만이면 검수 대기열로 간다.
- `severity`는 AI가 판정과 함께 내는 심각도(`critical`·`serious`·`moderate`)로, 위반(`fail`)에만 있다. 규칙 위반의 심각도는 axe의 impact를 쓴다.
- `selector`가 `title`처럼 화면에 안 보이는 요소면 오버레이는 그리지 않고 목록에만 보인다.

## 지켜야 할 것

- `fix.before`는 `page.html` 안에 **정확히 한 번** 나오는 문자열이다. "수정 코드 적용"은 문자열 치환으로 동작한다.
- 수정은 함께 적용하는 것을 전제로 한다. `signup`의 `#phone` 수정은 `.error-text` 클래스를 쓰므로, 대비 수정(`#pw-confirm-error`) 없이 혼자 적용하면 재점검에서 새 대비 위반이 하나 생긴다.
- 모든 수정을 적용한 페이지는 axe 위반 0건이어야 한다.
- axe 태그는 `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice`로 맞췄다. 태그를 바꾸면 위 표를 다시 확인한다.
- axe의 "확인 필요(incomplete)" 결과 중 AI 후보로 넘길 것은 규칙별로 고른다. `shop`의 별점·수량 버튼 보류(대비, 이름 불일치)는 글자가 기호(★, −, +)뿐이라 생기는 것이라 후보가 아니고, `notice`의 `video-caption` 보류는 후보다.

## axe가 통과시키지만 KWCAG로는 위반인 것

설계 단계에서 "규칙"으로 분류했다가 실제로 돌려 보고 AI 쪽으로 옮긴 항목이다. 발표 자료의 근거로 쓴다.

| 항목 | axe 동작(4.14) | KWCAG |
| --- | --- | --- |
| placeholder만 있는 입력칸 | placeholder를 이름으로 인정해 `label` 통과 | 7.3.2 레이블 제공 위반 |
| 본문 바로가기 없음 | 제목(h1~h6)이 있으면 `bypass` 통과 | 6.4.1 반복 영역 건너뛰기 위반 |
| 제목 셀 없는 데이터 표 | 레이아웃 표로 보고 검사하지 않음 | 5.3.1 표의 구성 위반 |
| 소리 있는 영상 자동 재생 | 미디어를 못 읽으면 보고하지 않음 | 5.4.2 자동 재생 금지 위반 |
| 자막 없는 영상 | 위반이 아니라 "확인 필요"로 보류 | 5.2.1 자막 제공 위반 |
