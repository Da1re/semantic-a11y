import { useCopyText, type CopyStatus } from '../../../hooks/use-copy-text';

const STATUS_MESSAGE: Record<CopyStatus, string> = {
  idle: '',
  copied: '수정 코드를 복사했습니다.',
  failed: '복사하지 못했습니다. 위 코드를 직접 선택해 복사해 주세요.',
};

interface CopyFixButtonProps {
  code: string;
}

export function CopyFixButton({ code }: CopyFixButtonProps) {
  const { status, copy } = useCopyText();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => copy(code)}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:border-slate-500"
      >
        수정 코드 복사
      </button>
      {/* 복사 결과를 화면낭독기에도 알리려고 처음부터 상태 영역을 둔다 */}
      <span role="status" className="text-sm text-slate-700">
        {STATUS_MESSAGE[status]}
      </span>
    </div>
  );
}
