import { useState } from 'react';

export type CopyStatus = 'idle' | 'copied' | 'failed';

export function useCopyText() {
  const [status, setStatus] = useState<CopyStatus>('idle');

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      // 권한 거부·비보안 출처에서는 클립보드 API가 실패한다. 직접 선택해 복사하도록 안내한다
      setStatus('failed');
    }
  };

  return { status, copy };
}
