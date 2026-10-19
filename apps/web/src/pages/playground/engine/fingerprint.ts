// 재점검 비교와 이슈 중복 방지에 쓰려면 같은 위반이 늘 같은 값을 내야 해서, 짧고 결정적인 FNV-1a 32비트 해시를 쓴다
export function fingerprint(parts: string[]): string {
  let hash = 0x811c9dc5;
  for (const char of parts.join('|')) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
