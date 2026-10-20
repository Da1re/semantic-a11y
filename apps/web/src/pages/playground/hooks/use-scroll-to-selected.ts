import { useEffect } from 'react';
import type { Violation } from '../engine/types';
import { usePlaygroundStore } from '../store/use-playground-store';

export function useScrollToSelected(doc: Document, violations: Violation[]) {
  // 키보드로 옮겨 다니는 항목을 먼저 따라가고, 목록에서 초점이 빠지면 선택한 항목으로 돌아온다.
  // 마우스를 올린 것(highlighted)은 따라가지 않는다. 지나가기만 해도 미리보기가 흔들리기 때문이다
  const target = usePlaygroundStore((state) => state.focused ?? state.selected);

  useEffect(() => {
    const selector = violations.find((v) => v.fingerprint === target)?.selector;
    const rect = selector ? doc.querySelector(selector)?.getBoundingClientRect() : undefined;
    const win = doc.defaultView;
    if (!win || !rect || rect.height === 0) return;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    // scrollIntoView는 바깥 페이지까지 움직여 목록 위치를 잃게 하므로 미리보기 안만 스크롤한다
    win.scrollTo({ top: win.scrollY + rect.top + rect.height / 2 - win.innerHeight / 2, behavior });
  }, [doc, violations, target]);
}
