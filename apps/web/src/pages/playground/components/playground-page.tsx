import { FormProvider, useForm } from 'react-hook-form';
import { INPUT_SOURCE } from '../constants/input-source';
import { SAMPLE_ID } from '../constants/sample';
import type { AuditFormValues } from '../models/audit-form';
import { PlaygroundStoreProvider } from '../store/playground-store-provider';
import { ReviewStoreProvider } from '../store/review-store-provider';
import { AuditForm } from './input/audit-form';
import { PreviewFrame } from './preview/preview-frame';
import { ReportPanel } from './report/report-panel';

export function PlaygroundPage() {
  const form = useForm<AuditFormValues>({
    defaultValues: { source: INPUT_SOURCE.SAMPLE, sampleId: SAMPLE_ID.SHOP, html: '' },
  });

  return (
    <ReviewStoreProvider>
      <PlaygroundStoreProvider>
        <div className="mx-auto max-w-[96rem] px-6 py-10">
          <h1 className="text-3xl font-bold">플레이그라운드</h1>
          <p className="mt-2 max-w-3xl text-slate-700">
            샘플 페이지를 점검하면 규칙 엔진(axe-core)이 찾은 위반과 AI가 의미로 판정한 위반을 미리보기 위에 표시합니다.
            axe-core는 브라우저에서 실제로 실행하고, AI 판정은 샘플마다 미리 준비한 결과(mock)를 씁니다. 직접 붙여 넣은
            HTML은 AI 판정 없이 규칙(axe) 결과만 보여 줍니다.
          </p>
          <FormProvider {...form}>
            <AuditForm />
            <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
              <PreviewFrame />
              <ReportPanel />
            </div>
          </FormProvider>
        </div>
      </PlaygroundStoreProvider>
    </ReviewStoreProvider>
  );
}
