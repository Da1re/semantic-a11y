import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { AiConnectionFormValues } from '../../../models/ai-connection';

export function ApiKeyField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AiConnectionFormValues>();
  const inputId = useId();
  const errorId = useId();
  const error = errors.apiKey?.message;

  return (
    <div>
      <div className="flex h-6 items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-semibold">
          Claude API 키
        </label>
        {/* 2026-10-21 공식 문서에서 확인한 키 발급 페이지 */}
        <a
          href="https://platform.claude.com/settings/keys"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-700 underline"
        >
          키 발급(새 창)
        </a>
      </div>
      <input
        id={inputId}
        // 화면 공유·어깨 너머로 키가 보이지 않게 가리고, 브라우저가 비밀번호로 저장하지 않게 한다
        type="password"
        autoComplete="off"
        spellCheck={false}
        placeholder="sk-ant-…"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...register('apiKey', { validate: (value) => value.trim() !== '' || 'API 키를 넣어 주세요.' })}
        className="mt-1.5 block h-11 w-full rounded-lg border border-slate-300 px-3 font-mono text-sm aria-invalid:border-red-700"
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm font-semibold text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
