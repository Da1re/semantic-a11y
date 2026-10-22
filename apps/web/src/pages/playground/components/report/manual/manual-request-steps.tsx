import { useId } from 'react';
import { useCopyText, type CopyStatus } from '../../../hooks/use-copy-text';
import { useCurrentAudit } from '../../../hooks/use-current-audit';
import { useImageSheetDownload, type SheetStatus } from '../../../hooks/use-image-sheet-download';

const BUTTON = 'mt-1 h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold hover:bg-slate-50';

const COPY_TEXT: Record<CopyStatus, string> = {
  idle: '',
  copied: '복사했습니다. 내 AI의 새 대화에 붙여 넣으세요.',
  failed: '복사하지 못했습니다. 아래 "요청 전문 보기"를 펼쳐 직접 복사해 주세요.',
};

const SHEET_TEXT: Record<SheetStatus, string> = {
  idle: '',
  working: '이미지를 묶고 있습니다.',
  done: 'semantic-a11y-images.png를 내려받았습니다. 요청과 함께 첨부하세요.',
  failed: '이미지를 만들지 못했습니다. 위 "AI 판정" 설정에서 이미지를 끄고 다시 점검해 주세요.',
};

export function ManualRequestSteps() {
  const { data } = useCurrentAudit();
  const { status: copyStatus, copy } = useCopyText();
  const { status: sheetStatus, download } = useImageSheetDownload();
  const promptId = useId();
  const request = data?.manualRequest;
  if (!request) return null;

  const imageCount = request.images.length;

  return (
    <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm text-slate-800">
      <li>
        <p className="font-semibold">요청 복사</p>
        <button type="button" onClick={() => void copy(request.prompt)} className={BUTTON}>
          요청 복사({request.prompt.length.toLocaleString('ko-KR')}자)
        </button>
        <p role="status" className="mt-1 text-slate-600">
          {COPY_TEXT[copyStatus]}
        </p>
        <details className="mt-1">
          <summary className="cursor-pointer text-blue-700 underline">요청 전문 보기</summary>
          <label htmlFor={promptId} className="sr-only">
            내 AI에 보낼 요청
          </label>
          <textarea id={promptId} readOnly value={request.prompt} rows={6} className="mt-2 w-full rounded-lg border border-slate-300 p-2 font-mono text-xs" />
        </details>
      </li>
      {imageCount > 0 && (
        <li>
          <p className="font-semibold">이미지 {imageCount}장을 한 장으로 내려받기</p>
          <button type="button" onClick={() => void download(request.images)} className={BUTTON}>
            이미지 내려받기
          </button>
          <p role="status" className="mt-1 text-slate-600">
            {SHEET_TEXT[sheetStatus]}
          </p>
        </li>
      )}
      <li>
        <p className="font-semibold">내 AI에 보내기</p>
        <p className="mt-1 text-slate-700">
          Claude 앱 등 내가 쓰는 AI에서 새 대화를 열고, 요청을 붙여 넣고 {imageCount > 0 ? '이미지를 첨부해 ' : ''}보냅니다. 답으로 온
          JSON을 그대로 복사해 아래에 붙여 넣습니다.
        </p>
      </li>
    </ol>
  );
}
