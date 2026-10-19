// 샘플 이미지가 수십 KB짜리 data URI라서, 줄이지 않으면 리포트의 코드 조각이 읽히지 않는다
export function toSnippet(html: string): string {
  const compact = html.replace(/data:[^"]{40,}/g, 'data:…');
  if (compact.length <= 300) return compact;
  return `${compact.slice(0, 300)}…`;
}
