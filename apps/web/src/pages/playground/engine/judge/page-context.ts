export interface PageSummary {
  title: string;
  lang: string;
  headings: string[];
  firstFocusables: string[];
}

function normalize(text: string | null | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim();
}

function toOwnText(el: Element): string {
  const own = Array.from(el.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? '');
  return normalize(own.join(' '));
}

function toFocusableLabel(el: Element): string {
  const href = el.getAttribute('href');
  const name = normalize(el.getAttribute('aria-label') ?? el.textContent).slice(0, 40);
  const target = href ? ` href="${href}"` : '';
  return `<${el.tagName.toLowerCase()}${target}> ${name}`;
}

export function toPageSummary(doc: Document): PageSummary {
  return {
    title: normalize(doc.title),
    lang: doc.documentElement.lang,
    headings: Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .slice(0, 15)
      .map((h) => `${h.tagName.toLowerCase()} ${normalize(h.textContent).slice(0, 60)}`),
    // 건너뛰기 링크(6.4.1)가 있는지는 처음 초점이 가는 요소 몇 개로 판단한다
    firstFocusables: Array.from(
      doc.body.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'),
    )
      .slice(0, 3)
      .map(toFocusableLabel),
  };
}

// 위치·색으로만 안내하는 문장(5.3.3, 5.4.1)은 axe도 extractCandidates도 보지 않는 일반 글이라 낱말로 골라낸다
function isSensoryText(el: Element): boolean {
  const text = toOwnText(el);
  if (text === '' || text.length > 200) return false;
  return /(빨간|빨강|붉은|파란|파랑|초록|녹색|노란|노랑|색으로|색상|오른쪽|왼쪽|위쪽|아래쪽|상단|하단|\bred\b|\bgreen\b|\bblue\b|colou?r|\bright\b|\bleft\b|above|below)/i.test(
    text,
  );
}

/** 머리글(6.4.1 판단 위치), 현재 단계 목록(5.4.1 오탐 확인), 감각 안내 문장을 모은다 */
export function collectContextElements(doc: Document, exclude: ReadonlySet<Element>) {
  const header = doc.querySelector('header, [role="banner"]');
  const stepLists = Array.from(doc.querySelectorAll('ol, ul')).filter((list) => list.querySelector(':scope > [aria-current]'));
  const texts = Array.from(doc.body.querySelectorAll('p, span, li, small, strong, em, legend, dd, dt, div'))
    .filter((el) => !exclude.has(el) && isSensoryText(el))
    .slice(0, 15);
  return {
    regions: header ? [header] : [],
    texts: [...stepLists, ...texts].filter((el) => !exclude.has(el)),
  };
}
