// 미리보기 iframe은 allow-popups 없이 띄워서 새 창 이동이 막힌다.
// 링크를 모두 새 창 대상으로 돌려, 샘플 안 링크를 눌러도 iframe 안에 이 앱이 다시 뜨지 않게 한다.
// 인라인 핸들러(onclick 등)는 샌드박스가 막으면서 콘솔 오류를 내므로, 판정 근거로 남기되 이름만 바꾼다.
export function toPreviewHtml(html: string): string {
  return html.replace('<head>', '<head><base target="_blank">').replace(/\son([a-z]+)=/g, ' data-sa11y-on$1=');
}
