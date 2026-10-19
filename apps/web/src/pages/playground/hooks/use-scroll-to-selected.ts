import { useEffect } from 'react';
import type { Violation } from '../engine/types';
import { usePlaygroundStore } from '../store/use-playground-store';

export function useScrollToSelected(doc: Document, violations: Violation[]) {
  const selected = usePlaygroundStore((state) => state.selected);

  useEffect(() => {
    const selector = violations.find((v) => v.fingerprint === selected)?.selector;
    const rect = selector ? doc.querySelector(selector)?.getBoundingClientRect() : undefined;
    const win = doc.defaultView;
    if (!win || !rect || rect.height === 0) return;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    // scrollIntoView는 바깥 페이지까지 움직여 목록 위치를 잃게 하므로 미리보기 안만 스크롤한다
    win.scrollTo({ top: win.scrollY + rect.top + rect.height / 2 - win.innerHeight / 2, behavior });
  }, [doc, violations, selected]);
}
