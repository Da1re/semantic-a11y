import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';

interface RejectFormValues {
  reason: string;
}

interface RejectFormProps {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}

export function RejectForm({ onSubmit, onCancel }: RejectFormProps) {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<RejectFormValues>({ defaultValues: { reason: '' } });
  const inputId = useId();
  const errorId = useId();
  const error = errors.reason?.message;

  // 반려 버튼을 누르면 버튼이 사라지므로, 키보드 사용자가 바로 사유를 쓰도록 입력칸으로 초점을 옮긴다
  useEffect(() => setFocus('reason'), [setFocus]);

  return (
    <form onSubmit={handleSubmit(({ reason }) => onSubmit(reason.trim()))} noValidate className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-semibold">
        반려 사유 <span className="font-normal text-slate-600">(필수)</span>
      </label>
      <textarea
        id={inputId}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...register('reason', { validate: (value) => value.trim() !== '' || '반려 사유를 적어 주세요.' })}
        className="block w-full rounded-md border border-slate-400 p-2 text-sm aria-invalid:border-red-700"
      />
      {error && (
        <p id={errorId} className="text-sm font-semibold text-red-800">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-900">
          반려 확정
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:border-slate-500"
        >
          취소
        </button>
      </div>
    </form>
  );
}
