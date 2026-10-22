import type { ImageAttachment } from '../candidate-images';

const CELL = 480;
const LABEL_HEIGHT = 48;
const PADDING = 16;
const MAX_COLUMNS = 3;

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = dataUrl;
  return img.decode().then(() => img);
}

// 번호는 요청 글의 "번호. 선택자" 목록과 같다. 선택자도 함께 적어 번호를 잘못 읽어도 알아볼 수 있게 한다
function drawCell(context: CanvasRenderingContext2D, img: HTMLImageElement, index: number, selector: string) {
  const x = (index % MAX_COLUMNS) * CELL;
  const y = Math.floor(index / MAX_COLUMNS) * (CELL + LABEL_HEIGHT);
  context.fillStyle = 'rgb(15, 23, 42)';
  context.font = 'bold 24px sans-serif';
  context.fillText(`${index + 1}. ${selector}`, x + PADDING, y + 32, CELL - PADDING * 2);
  const box = CELL - PADDING * 2;
  const scale = Math.min(box / img.naturalWidth, box / img.naturalHeight);
  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;
  context.strokeStyle = 'rgb(203, 213, 225)';
  context.strokeRect(x + PADDING, y + LABEL_HEIGHT, box, box);
  context.drawImage(img, x + PADDING + (box - width) / 2, y + LABEL_HEIGHT + (box - height) / 2, width, height);
}

function toPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('이미지를 만들지 못했습니다.'))), 'image/png');
  });
}

// 채팅 앱에 이미지를 하나씩 첨부하기 번거로워서 후보 이미지를 번호를 붙여 한 장으로 묶는다
export async function composeImageSheet(images: ImageAttachment[]): Promise<Blob> {
  const loaded = await Promise.all(images.map((image) => loadImage(image.dataUrl)));
  const columns = Math.min(MAX_COLUMNS, images.length);
  const rows = Math.ceil(images.length / MAX_COLUMNS);
  const canvas = document.createElement('canvas');
  canvas.width = columns * CELL;
  canvas.height = rows * (CELL + LABEL_HEIGHT);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('이미지를 만들지 못했습니다.');
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);
  loaded.forEach((img, index) => drawCell(context, img, index, images[index]?.selector ?? ''));
  return toPngBlob(canvas);
}
