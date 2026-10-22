import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AuditFormValues } from '../../models/audit-form';

export function HtmlInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AuditFormValues>();
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const error = errors.html?.message;
  const describedBy = error ? `${hintId} ${errorId}` : hintId;

  return (
    <div>
      <label htmlFor={inputId} className="block text-lg font-bold">
        점검할 HTML <span className="text-sm font-normal text-slate-600">(필수)</span>
      </label>
      <p id={hintId} className="mt-1 text-sm text-slate-600">
        페이지 소스 전체나 일부를 붙여 넣으세요. 스크립트와 이벤트 처리기는 실행되지 않게 정리한 뒤 점검하고, 50만 자까지
        받습니다. AI를 연결하지 않으면 규칙(axe) 결과만 보여 줍니다.
      </p>
      <textarea
        id={inputId}
        rows={10}
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...register('html', {
          // 샘플을 고른 상태에서는 이 칸이 화면에 없으므로 HTML을 고른 경우에만 검사한다
          validate: (value, { source }) => {
            if (source !== 'html') return true;
            if (value.trim() === '') return 'HTML을 붙여 넣어 주세요.';
            return value.length <= 500_000 || 'HTML은 50만 자까지 붙여 넣을 수 있습니다.';
          },
        })}
        className="mt-3 block w-full rounded-lg border border-slate-400 p-3 font-mono text-sm aria-invalid:border-red-700"
      />
      {error && (
        <p id={errorId} className="mt-2 text-sm font-semibold text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
