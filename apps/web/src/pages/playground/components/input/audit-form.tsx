import { useQueryClient } from '@tanstack/react-query';
import { useFormContext, useWatch } from 'react-hook-form';
import { toLlmTarget } from '../../models/ai-connection';
import type { AuditFormValues } from '../../models/audit-form';
import { toAuditTarget } from '../../models/audit-target';
import { useAiConnectionStore } from '../../store/use-ai-connection-store';
import { usePlaygroundStore } from '../../store/use-playground-store';
import { HtmlInput } from './html-input';
import { SamplePicker } from './sample-picker';
import { SourcePicker } from './source-picker';

const SOURCE_INPUT = { sample: <SamplePicker />, html: <HtmlInput /> } as const;

export function AuditForm() {
  const { handleSubmit } = useFormContext<AuditFormValues>();
  const source = useWatch<AuditFormValues, 'source'>({ name: 'source' });
  const startAudit = usePlaygroundStore((state) => state.startAudit);
  const connection = useAiConnectionStore((state) => state.connection);
  const queryClient = useQueryClient();
  const onSubmit = handleSubmit(async (values) => {
    const target = await toAuditTarget(values, toLlmTarget(connection));
    // 실패한 점검은 오류로 캐시에 남아 같은 대상을 다시 눌러도 돌지 않는다. 키를 고친 뒤 다시 누르면 돌도록 실패한 것만 비운다
    queryClient.removeQueries({ queryKey: ['audit'], predicate: (query) => query.state.status === 'error' });
    startAudit(target);
  });

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
