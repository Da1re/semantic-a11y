import { FormProvider, useForm } from 'react-hook-form';
import { useAiConnectionActions } from '../../hooks/use-ai-connection-actions';
import { toAiConnection, toConnectionFormValues, type AiConnectionFormValues } from '../../models/ai-connection';
import { useAiConnectionStore } from '../../store/use-ai-connection-store';
import { ConnectionOptions } from './fields/connection-options';
import { ModelField } from './fields/model-field';

interface AiSettingsFormProps {
  onDone: () => void;
}

// 이미 연결된 키는 그대로 두고 모델·옵션만 바꾼다(키를 다시 붙여 넣지 않아도 되게)
export function AiSettingsForm({ onDone }: AiSettingsFormProps) {
  const connection = useAiConnectionStore((state) => state.connection);
  const form = useForm<AiConnectionFormValues>({ defaultValues: toConnectionFormValues(connection) });
  const { connect } = useAiConnectionActions();
  const onSubmit = form.handleSubmit((values) => {
    connect(toAiConnection(values));
    onDone();
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate aria-label="AI 연결 설정" className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[18rem_auto] md:items-start md:justify-start">
          <ModelField />
          <button
            type="submit"
            className="h-11 rounded-lg bg-blue-700 px-5 font-semibold text-white hover:bg-blue-800 md:mt-7.5"
          >
            저장
          </button>
        </div>
        <ConnectionOptions />
      </form>
    </FormProvider>
  );
}
