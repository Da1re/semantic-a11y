import { useId } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { LLM_MODEL_PRESET } from '../../../constants/llm-provider';
import { CUSTOM_MODEL, type AiConnectionFormValues } from '../../../models/ai-connection';

export function ModelField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AiConnectionFormValues>();
  const provider = useWatch<AiConnectionFormValues, 'provider'>({ name: 'provider' });
  const modelChoice = useWatch<AiConnectionFormValues, 'modelChoice'>({ name: 'modelChoice' });
  const selectId = useId();
  const customId = useId();
  const errorId = useId();
  const error = errors.customModel?.message;

  return (
    <div>
      <label htmlFor={selectId} className="flex h-6 items-center text-sm font-semibold">
        모델
      </label>
      <select
        id={selectId}
        {...register('modelChoice')}
        className="mt-1.5 block h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
      >
        {LLM_MODEL_PRESET[provider].map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.id} · {preset.note}
          </option>
        ))}
        <option value={CUSTOM_MODEL}>직접 입력</option>
      </select>
      {modelChoice === CUSTOM_MODEL && (
        <div className="mt-2">
          <label htmlFor={customId} className="sr-only">
            모델 id
          </label>
          <input
            id={customId}
            type="text"
            spellCheck={false}
            autoComplete="off"
            placeholder="모델 id"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...register('customModel', {
              validate: (value, { modelChoice: choice }) => choice !== CUSTOM_MODEL || value.trim() !== '' || '모델 id를 적어 주세요.',
            })}
            className="block h-11 w-full rounded-lg border border-slate-300 px-3 font-mono text-sm aria-invalid:border-red-700"
          />
          {error && (
            <p id={errorId} className="mt-1 text-sm font-semibold text-red-800">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
