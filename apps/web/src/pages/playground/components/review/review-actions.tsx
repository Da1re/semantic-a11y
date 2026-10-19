import { useRef, useState } from 'react';
import { REVIEW_STATUS_LABEL } from '../../constants/review-status';
import { useReviewStore } from '../../store/use-review-store';
import { RejectForm } from './reject-form';

const BUTTON_CLASS = 'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:border-slate-500';

interface ReviewActionsProps {
  fingerprint: string;
}

export function ReviewActions({ fingerprint }: ReviewActionsProps) {
  const decision = useReviewStore((state) => state.decisions[fingerprint]);
  const approve = useReviewStore((state) => state.approve);
  const reject = useReviewStore((state) => state.reject);
  const undo = useReviewStore((state) => state.undo);
  const [isRejecting, setIsRejecting] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const rejectButtonRef = useRef<HTMLButtonElement>(null);

  // 누른 버튼이 결정 후 사라지므로, 초점이 문서 처음으로 튀지 않게 결과 문장으로 옮긴다
  const focusAfterRender = (target: { current: HTMLElement | null }) =>
    requestAnimationFrame(() => target.current?.focus());
  const decide = (run: () => void) => {
    run();
    setIsRejecting(false);
    focusAfterRender(statusRef);
  };
  const cancelReject = () => {
    setIsRejecting(false);
    focusAfterRender(rejectButtonRef);
  };
  const statusText = decision ? REVIEW_STATUS_LABEL[decision.status].ko : '아직 검수하지 않았습니다.';
  const rejectReason = decision?.status === 'rejected' ? ` · 사유: ${decision.reason}` : '';

  return (
    <div className="space-y-2 border-t border-slate-200 pt-3">
      <p ref={statusRef} tabIndex={-1} className="text-sm font-semibold">
        {statusText}
        <span className="font-normal">{rejectReason}</span>
      </p>
      {decision && (
        <button type="button" onClick={() => decide(() => undo(fingerprint))} className={BUTTON_CLASS}>
          되돌리기
        </button>
      )}
      {!decision && isRejecting && (
        <RejectForm onSubmit={(reason) => decide(() => reject(fingerprint, reason))} onCancel={cancelReject} />
      )}
      {!decision && !isRejecting && (
        <div className="flex gap-2">
          <button type="button" onClick={() => decide(() => approve(fingerprint))} className={BUTTON_CLASS}>
            승인
          </button>
          <button ref={rejectButtonRef} type="button" onClick={() => setIsRejecting(true)} className={BUTTON_CLASS}>
            반려
          </button>
        </div>
      )}
    </div>
  );
}
