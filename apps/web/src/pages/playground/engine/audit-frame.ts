export interface AuditFrame {
  doc: Document;
  win: Window;
  remove: () => void;
}

// 대비·터치 영역 같은 규칙은 실제 레이아웃이 있어야 계산되므로, 숨기지 않고 화면 밖에 실제 크기로 렌더링한다
export function mountAuditFrame(html: string): Promise<AuditFrame> {
  const iframe = document.createElement('iframe');
  iframe.title = '접근성 점검용 프레임';
  iframe.tabIndex = -1;
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:1280px;height:900px;border:0;';

  return new Promise((resolve, reject) => {
    iframe.addEventListener(
      'load',
      () => {
        const doc = iframe.contentDocument;
        const win = iframe.contentWindow;
        if (!doc || !win) {
          iframe.remove();
          reject(new Error('점검용 프레임을 열지 못했습니다.'));
          return;
        }
        // 첫 화면 아래 요소도 대비를 계산할 수 있게 문서 전체 높이로 늘린다
        iframe.style.height = `${doc.documentElement.scrollHeight}px`;
        resolve({ doc, win, remove: () => iframe.remove() });
      },
      { once: true },
    );
    iframe.srcdoc = html;
    document.body.append(iframe);
  });
}
