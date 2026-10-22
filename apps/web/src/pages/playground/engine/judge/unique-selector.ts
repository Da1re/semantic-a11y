function toIdSelector(el: Element, doc: Document): string | null {
  if (!el.id) return null;
  const selector = `#${CSS.escape(el.id)}`;
  return doc.querySelectorAll(selector).length === 1 ? selector : null;
}

function toNthSegment(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const sameTag = Array.from(el.parentElement?.children ?? []).filter((sibling) => sibling.tagName === el.tagName);
  if (sameTag.length <= 1) return tag;
  return `${tag}:nth-of-type(${sameTag.indexOf(el) + 1})`;
}

function toAncestors(el: Element, doc: Document): Element[] {
  const chain: Element[] = [];
  for (let node: Element | null = el; node && node !== doc.documentElement; node = node.parentElement) chain.push(node);
  return chain;
}

// 모델이 판정 결과를 돌려줄 때 요소를 다시 찾을 수 있어야 해서, 문서에서 그 요소 하나만 가리키는 선택자를 만든다.
// id가 있으면 그대로 쓰고(샘플 정답과도 이 형식으로 맞춘다), 없으면 가장 가까운 고유 id 조상부터 경로를 잇는다
export function toUniqueSelector(el: Element, doc: Document): string {
  const own = toIdSelector(el, doc);
  if (own) return own;
  if (el.tagName === 'TITLE') return 'title';

  const chain = toAncestors(el, doc);
  const anchorIndex = chain.findIndex((node, index) => index > 0 && toIdSelector(node, doc) !== null);
  const anchorEl = anchorIndex === -1 ? undefined : chain[anchorIndex];
  const anchor = (anchorEl && toIdSelector(anchorEl, doc)) ?? 'html';
  const path = anchorIndex === -1 ? chain : chain.slice(0, anchorIndex);
  return [anchor, ...path.reverse().map(toNthSegment)].join(' > ');
}
