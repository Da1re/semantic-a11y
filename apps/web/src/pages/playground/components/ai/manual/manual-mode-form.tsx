import { useForm, useWatch } from 'react-hook-form';
import { useAiConnectionActions } from '../../../hooks/use-ai-connection-actions';
import { toManualConnection } from '../../../models/ai-connection';
import { useAiConnectionStore } from '../../../store/use-ai-connection-store';

interface ManualModeFormProps {
  onDone: () => void;
}

interface ManualModeFormValues {
  vision: boolean;
}

export function ManualModeForm({ onDone }: ManualModeFormProps) {
  const vision = useAiConnectionStore((state) => state.connection?.vision ?? true);
  const { connect } = useAiConnectionActions();
  const { register, handleSubmit, control } = useForm<ManualModeFormValues>({ defaultValues: { vision } });
  const visionOn = useWatch({ control, name: 'vision' });
  const onSubmit = handleSubmit((values) => {
    connect(toManualConnection(values.vision));
    onDone();
  });

  return (
    <form onSubmit={onSubmit} noValidate aria-label="내 AI로 판정" className="space-y-3">
      <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-800">
        <li>점검하기를 누르면 결과 패널에 AI에게 보낼 요청과 이미지 한 장이 준비됩니다.</li>
        <li>Claude 앱 등 내가 쓰는 AI의 새 대화에 요청을 붙여 넣고 이미지를 첨부해 보냅니다.</li>
        <li>AI가 돌려준 JSON을 결과 패널에 붙여 넣으면 같은 검증기와 정답표로 채점합니다.</li>
      </ol>
      <p className="max-w-3xl text-sm text-slate-600">
        API 키와 결제가 필요 없고, 내가 구독 중인 AI의 사용량으로 판정합니다. 페이지 내용은 내가 붙여 넣은 AI 서비스로만 갑니다.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:border-slate-400 has-checked:border-blue-700 has-checked:bg-blue-50">
          <input type="checkbox" {...register('vision')} className="size-4 accent-blue-700" />
          이미지도 판정에 쓰기
        </label>
        <button type="submit" className="h-10 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">
          이 방식으로 판정
        </button>
      </div>
      {!visionOn && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950">
          이미지를 쓰지 않으면 대체 텍스트(KWCAG 5.1.1) 판정이 불안정해서, 그 판정은 신뢰도를 낮춰 사람 확인으로 보냅니다.
        </p>
      )}
    </form>
  );
}
