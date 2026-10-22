import { FormProvider, useForm } from 'react-hook-form';
import { INPUT_SOURCE } from '../constants/input-source';
import { SAMPLE_ID } from '../constants/sample';
import type { AuditFormValues } from '../models/audit-form';
import { AiConnectionStoreProvider } from '../store/ai-connection-store-provider';
import { PlaygroundStoreProvider } from '../store/playground-store-provider';
import { ReviewStoreProvider } from '../store/review-store-provider';
import { AiConnectionPanel } from './ai/ai-connection-panel';
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
        <AiConnectionStoreProvider>
          <div className="mx-auto max-w-[96rem] px-6 py-10">
            <h1 className="text-3xl font-bold">플레이그라운드</h1>
            <p className="mt-2 max-w-3xl text-slate-700">
              샘플 페이지를 점검하면 규칙 엔진(axe-core)이 찾은 위반과 AI가 의미로 판정한 위반을 미리보기 위에 표시합니다.
              axe-core는 브라우저에서 실제로 실행합니다. AI 판정은 "내 AI로 판정"(내가 쓰는 AI에 요청을 붙여 넣고 답을 가져오기)이나
              Claude API 키로 실제 모델이 하고, 둘 다 쓰지 않으면 샘플마다 미리 준비한 결과(mock)를 씁니다. 직접 붙여 넣은 HTML은
              실제 모델로 판정할 때만 AI 판정을 합니다.
            </p>
            <AiConnectionPanel />
            <FormProvider {...form}>
              <AuditForm />
              <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
                <PreviewFrame />
                <ReportPanel />
              </div>
            </FormProvider>
          </div>
        </AiConnectionStoreProvider>
      </PlaygroundStoreProvider>
    </ReviewStoreProvider>
  );
}
