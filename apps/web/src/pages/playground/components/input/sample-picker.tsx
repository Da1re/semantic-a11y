import { useFormContext } from 'react-hook-form';
import { SAMPLE_ID, SAMPLE_LABEL } from '../../constants/sample';
import type { AuditFormValues } from '../../models/audit-form';
import { SAMPLE_CATALOG } from '../../samples';
import { usePlaygroundStore } from '../../store/use-playground-store';

export function SamplePicker() {
  const { register } = useFormContext<AuditFormValues>();
  const clearAudit = usePlaygroundStore((state) => state.clearAudit);

  return (
    <fieldset>
      <legend className="text-lg font-bold">샘플 페이지</legend>
      <p className="mt-1 text-sm text-slate-600">
        직접 만든 가상 사이트입니다. 고르면 미리보기에 바로 보이고, 점검하기를 누르면 위반 위치를 표시합니다.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {Object.values(SAMPLE_ID).map((id) => (
          <label
            key={id}
            className="flex cursor-pointer gap-3 rounded-xl border-2 border-slate-200 p-4 hover:border-slate-400 has-checked:border-blue-700 has-checked:bg-blue-50"
          >
            <input
              type="radio"
              value={id}
              // 다른 샘플을 고르면 이전 점검 결과가 미리보기와 어긋나므로 결과 표시를 비운다
              {...register('sampleId', { onChange: clearAudit })}
              className="mt-1 size-4 shrink-0 accent-blue-700"
            />
            <span>
              <span className="block font-semibold">{SAMPLE_LABEL[id].ko}</span>
              <span className="block text-sm text-slate-600">{SAMPLE_CATALOG[id].site}</span>
              <span className="mt-2 block text-sm text-slate-700">{SAMPLE_CATALOG[id].summary}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
