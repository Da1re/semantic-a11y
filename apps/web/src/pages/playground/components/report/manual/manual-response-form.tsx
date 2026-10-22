import { useQueryClient } from '@tanstack/react-query';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { findManualResponseError } from '../../../engine/judge/manual/parse-manual-response';
import { withManualResponse } from '../../../models/audit-target';
import { usePlaygroundStore } from '../../../store/use-playground-store';

interface ManualResponseFormValues {
  response: string;
}

export function ManualResponseForm() {
  const auditTarget = usePlaygroundStore((state) => state.auditTarget);
  const startAudit = usePlaygroundStore((state) => state.startAudit);
  const queryClient = useQueryClient();
  const fieldId = useId();
  const errorId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualResponseFormValues>({ defaultValues: { response: auditTarget?.llm?.response ?? '' } });
  const error = errors.response?.message;
  // 읽을 수 없는 답으로 점검을 돌리면 결과 대신 오류 화면이 떠서 입력칸이 사라지므로, 보내기 전에 여기서 막는다
  const onSubmit = handleSubmit(({ response }) => {
    if (!auditTarget) return;
    queryClient.removeQueries({ queryKey: ['audit'], predicate: (query) => query.state.status === 'error' });
    startAudit(withManualResponse(auditTarget, response));
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4 space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-semibold">
        AI의 답(JSON) 붙여 넣기
      </label>
      <textarea
        id={fieldId}
        rows={6}
        spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...register('response', { validate: (value) => findManualResponseError(value) ?? true })}
        className="w-full rounded-lg border border-slate-300 bg-white p-2 font-mono text-xs"
      />
      {error && (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      )}
      <button type="submit" className="h-10 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">
        판정 반영
      </button>
    </form>
  );
}
