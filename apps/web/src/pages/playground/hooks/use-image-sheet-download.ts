import { useState } from 'react';
import type { ImageAttachment } from '../engine/judge/candidate-images';

export type SheetStatus = 'idle' | 'working' | 'done' | 'failed';

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  // 브라우저가 내려받기를 시작하기 전에 주소를 없애면 실패하는 경우가 있어 한 박자 늦게 해제한다
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function useImageSheetDownload() {
  const [status, setStatus] = useState<SheetStatus>('idle');

  const download = async (images: ImageAttachment[]) => {
    setStatus('working');
    try {
      // 캔버스 묶음은 내 AI로 판정할 때만 쓰므로 이때 불러온다
      const { composeImageSheet } = await import('../engine/judge/manual/image-sheet');
      saveBlob(await composeImageSheet(images), 'semantic-a11y-images.png');
      setStatus('done');
    } catch {
      setStatus('failed');
    }
  };

  return { status, download };
}
