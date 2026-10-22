import { FormProvider, useForm } from 'react-hook-form';
import { useAiConnectionActions } from '../../hooks/use-ai-connection-actions';
import { toAiConnection, toConnectionFormValues, type AiConnectionFormValues } from '../../models/ai-connection';
import { ApiKeyField } from './fields/api-key-field';
import { ConnectionOptions } from './fields/connection-options';
import { ModelField } from './fields/model-field';

interface AiConnectionFormProps {
  onDone: () => void;
}

// Claude API 키를 직접 붙여 넣는 연결. 키·모델·연결 버튼을 한 줄에 두고 옵션은 그 아래 작게 둔다
export function AiConnectionForm({ onDone }: AiConnectionFormProps) {
  const form = useForm<AiConnectionFormValues>({ defaultValues: toConnectionFormValues(null) });
  const { connect } = useAiConnectionActions();
  const onSubmit = form.handleSubmit((values) => {
    connect(toAiConnection(values));
    onDone();
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate aria-label="Claude API 키로 연결" className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_18rem_auto] md:items-start">
          <ApiKeyField />
          <ModelField />
          <button
            type="submit"
            className="h-11 rounded-lg bg-blue-700 px-5 font-semibold text-white hover:bg-blue-800 md:mt-7.5"
          >
            연결
          </button>
        </div>
        <ConnectionOptions />
      </form>
    </FormProvider>
  );
}
