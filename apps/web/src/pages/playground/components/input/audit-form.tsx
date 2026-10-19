import { useFormContext, useWatch } from 'react-hook-form';
import type { AuditFormValues } from '../../models/audit-form';
import { toAuditTarget } from '../../models/audit-target';
import { usePlaygroundStore } from '../../store/use-playground-store';
import { HtmlInput } from './html-input';
import { SamplePicker } from './sample-picker';
import { SourcePicker } from './source-picker';

const SOURCE_INPUT = { sample: <SamplePicker />, html: <HtmlInput /> } as const;

export function AuditForm() {
  const { handleSubmit } = useFormContext<AuditFormValues>();
  const source = useWatch<AuditFormValues, 'source'>({ name: 'source' });
  const startAudit = usePlaygroundStore((state) => state.startAudit);
  const onSubmit = handleSubmit(async (values) => startAudit(await toAuditTarget(values)));

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
      <SourcePicker />
      {SOURCE_INPUT[source]}
      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
      >
        점검하기
      </button>
    </form>
  );
}
