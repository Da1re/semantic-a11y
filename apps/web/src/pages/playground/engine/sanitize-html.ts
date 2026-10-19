import DOMPurify from 'dompurify';

// 인라인 핸들러는 "마우스로만 동작한다" 같은 키보드 판정의 근거라서 지우지 않고, 실행되지 않는 이름으로만 바꾼다
function renameInlineHandlers(element: Element) {
  const handlers = element.getAttributeNames().filter((name) => name.startsWith('on'));
  handlers.forEach((name) => {
    element.setAttribute(`data-sa11y-${name}`, element.getAttribute(name) ?? '');
    element.removeAttribute(name);
  });
}

// DOMPurify(SAFE_FOR_XML)는 글자 속에 "<영문자"가 있는 style을 통째로 지운다. 압축 CSS의 @media (width<40rem)도
// 여기에 걸려 스타일이 사라지면 대비·크기 점검이 실제와 달라지므로, 정리 전에 < 뒤에 공백을 넣는다(CSS 의미는 같다)
function spaceOutStyleMarkup(style: HTMLStyleElement) {
  style.textContent = (style.textContent ?? '').replace(/<(?=[/\w!])/g, '< ');
}

// 점검용 프레임은 axe를 실행하려고 스크립트를 허용하므로, 붙여 넣은 HTML은 반드시 정리한 뒤에 넣는다
export function sanitizeHtml(raw: string): string {
  const doc = new DOMParser().parseFromString(raw, 'text/html');
  doc.querySelectorAll('*').forEach(renameInlineHandlers);
  doc.querySelectorAll('style').forEach(spaceOutStyleMarkup);
  const clean = DOMPurify.sanitize(doc.documentElement.outerHTML, {
    WHOLE_DOCUMENT: true,
    // title은 기본 허용 목록에 없어서, 빼면 모든 페이지가 "문서 제목 없음"으로 잘못 보고된다
    ADD_TAGS: ['title'],
  });
  // doctype이 없으면 쿼크 모드로 그려져 대비·크기 계산이 실제 페이지와 달라진다
  return `<!doctype html>\n${clean}`;
}
