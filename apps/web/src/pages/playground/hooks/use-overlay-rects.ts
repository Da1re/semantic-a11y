import { useEffect, useState } from 'react';
import type { Violation } from '../engine/types';
import type { OverlayBoxData } from '../models/overlay-box';

function measure(doc: Document, violations: Violation[]): OverlayBoxData[] {
  const scrollX = doc.defaultView?.scrollX ?? 0;
  const scrollY = doc.defaultView?.scrollY ?? 0;
  const stacked = new Map<string, number>();
  return violations.flatMap((violation, index) => {
    const rect = doc.querySelector(violation.selector)?.getBoundingClientRect();
    // title처럼 화면에 그려지지 않는 요소는 오버레이 없이 목록에만 보인다
    if (!rect || rect.width === 0 || rect.height === 0) return [];
    const stackIndex = stacked.get(violation.selector) ?? 0;
    stacked.set(violation.selector, stackIndex + 1);
    // 테두리가 글자를 가리지 않도록 요소보다 3px씩 넓게 그린다
    const box = { top: rect.top + scrollY - 3, left: rect.left + scrollX - 3, width: rect.width + 6, height: rect.height + 6 };
    return [{ violation, number: index + 1, stackIndex, rect: box }];
  });
}

export function useOverlayRects(doc: Document, violations: Violation[]): OverlayBoxData[] {
  const [boxes, setBoxes] = useState<OverlayBoxData[]>([]);

  useEffect(() => {
    const frame = doc.defaultView?.frameElement;
    if (!frame) return;
    // 미리보기 너비가 바뀌면 샘플 레이아웃이 다시 흐르므로 위치를 다시 잰다. 관찰을 시작할 때도 한 번 불린다
    const observer = new ResizeObserver(() => setBoxes(measure(doc, violations)));
    observer.observe(frame);
    return () => observer.disconnect();
  }, [doc, violations]);

  return boxes;
}
