import type { CandidateImage, CandidateInput } from './candidate-input';

export interface ImageAttachment {
  selector: string;
  dataUrl: string;
}

function toDrawSize(img: HTMLImageElement): { width: number; height: number } | null {
  const rect = img.getBoundingClientRect();
  const width = img.naturalWidth || rect.width;
  const height = img.naturalHeight || rect.height;
  if (width === 0 || height === 0) return null;
  // 비용을 줄이려고 긴 변을 512px로 줄인다. alt와 내용을 비교하는 데는 이 크기로 충분하다
  const scale = Math.min(1, 512 / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

// 제공자는 SVG를 받지 않아서(PNG·JPEG·WEBP·GIF만) 샘플의 SVG 이미지를 PNG로 다시 그린다.
// 다른 출처 이미지는 캔버스가 오염돼 읽을 수 없으므로 null을 돌려 "이미지 없음"으로 판정하게 한다
function rasterize(img: HTMLImageElement): string | null {
  const size = toDrawSize(img);
  if (!img.complete || !size) return null;
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext('2d');
  if (!context) return null;
  // 투명 배경 PNG는 모델이 검은 배경으로 보기도 해서 흰 바탕을 깐다
  context.fillStyle = 'white';
  context.fillRect(0, 0, size.width, size.height);
  try {
    context.drawImage(img, 0, 0, size.width, size.height);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

function isImageElement(el: Element | undefined): el is HTMLImageElement {
  return el?.tagName === 'IMG';
}

export function attachImages(
  candidates: CandidateInput[],
  elements: ReadonlyMap<string, Element>,
  vision: boolean,
): { candidates: CandidateInput[]; images: ImageAttachment[] } {
  const images: ImageAttachment[] = [];
  const withImages = candidates.map((candidate): CandidateInput => {
    const el = elements.get(candidate.selector);
    if (candidate.kind !== 'image' || !isImageElement(el)) return candidate;
    if (!vision) return { ...candidate, image: 'off' };
    // 이미지가 많은 페이지에서 비용이 커지지 않게 20장까지만 보낸다
    const dataUrl = images.length < 20 ? rasterize(el) : null;
    const image: CandidateImage = dataUrl ? 'attached' : 'unavailable';
    if (dataUrl) images.push({ selector: candidate.selector, dataUrl });
    return { ...candidate, image };
  });
  return { candidates: withImages, images };
}
