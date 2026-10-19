import { useFormContext } from 'react-hook-form';
import { INPUT_SOURCE, INPUT_SOURCE_LABEL } from '../../constants/input-source';
import type { AuditFormValues } from '../../models/audit-form';
import { usePlaygroundStore } from '../../store/use-playground-store';

export function SourcePicker() {
  const { register } = useFormContext<AuditFormValues>();
  const clearAudit = usePlaygroundStore((state) => state.clearAudit);

  return (
    <fieldset>
      <legend className="text-lg font-bold">입력 방식</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {Object.values(INPUT_SOURCE).map((source) => (
          <label
            key={source}
            className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-slate-200 px-4 py-2 font-semibold hover:border-slate-400 has-checked:border-blue-700 has-checked:bg-blue-50"
          >
            <input
              type="radio"
              value={source}
              // 입력 방식을 바꾸면 미리보기가 바뀌어 이전 결과와 어긋나므로 결과 표시를 비운다
              {...register('source', { onChange: clearAudit })}
              className="size-4 accent-blue-700"
            />
            {INPUT_SOURCE_LABEL[source].ko}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
