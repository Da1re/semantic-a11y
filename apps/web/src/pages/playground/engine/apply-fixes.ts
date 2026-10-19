import type { Fix } from './types';

// 수정 코드에 $& 같은 치환 패턴 문자가 들어 있어도 그대로 넣으려고 문자열이 아니라 함수 replacer를 쓴다
export function applyFixes(html: string, fixes: Fix[]): string {
  return fixes.reduce((result, fix) => result.replace(fix.before, () => fix.after), html);
}
