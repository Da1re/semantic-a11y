// 규칙 엔진은 속성이 "있는지"만 본다. 내용이 맞는지 AI가 다시 봐야 하는 요소를 모은다
export function extractCandidates(doc: Document): Element[] {
  const selector = [
    'title',
    'img',
    '[role="img"]',
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    'table',
    'video',
    'audio',
    '[onclick]',
    '[onchange]',
  ].join(',');
  return Array.from(doc.querySelectorAll(selector));
}
