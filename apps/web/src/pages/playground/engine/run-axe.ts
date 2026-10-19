import type { AxeResults, RunOptions } from 'axe-core';
import type { AuditFrame } from './audit-frame';

interface AxeWindow extends Window {
  axe?: { run: (context: Document, options: RunOptions) => Promise<AxeResults> };
}

// axe는 자기가 실행된 문서만 검사할 수 있어서, 점검 대상 프레임 안에 소스를 넣어 그 안에서 실행한다
export async function runAxe(frame: AuditFrame): Promise<AxeResults> {
  const { default: axeSource } = await import('axe-core/axe.min.js?raw');
  const script = frame.doc.createElement('script');
  script.textContent = axeSource;
  frame.doc.head.append(script);

  const { axe } = frame.win as AxeWindow;
  if (!axe) throw new Error('axe-core를 불러오지 못했습니다.');
  return axe.run(frame.doc, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    resultTypes: ['violations'],
  });
}
