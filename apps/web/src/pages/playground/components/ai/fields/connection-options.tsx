import { useFormContext, useWatch } from 'react-hook-form';
import type { AiConnectionFormValues } from '../../../models/ai-connection';

const CHIP =
  'flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:border-slate-400 has-checked:border-blue-700 has-checked:bg-blue-50';

export function ConnectionOptions() {
  const { register } = useFormContext<AiConnectionFormValues>();
  const vision = useWatch<AiConnectionFormValues, 'vision'>({ name: 'vision' });

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className={CHIP}>
          <input type="checkbox" {...register('vision')} className="size-4 accent-blue-700" />
          이미지도 보내기
        </label>
        <label className={CHIP}>
          <input type="checkbox" {...register('remember')} className="size-4 accent-blue-700" />이 탭에 기억
        </label>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer text-blue-700 underline">키는 어디로 가나요?</summary>
        <ul className="mt-2 max-w-2xl list-disc space-y-1 pl-5 text-slate-700">
          <li>키는 이 브라우저에서 Anthropic으로만 바로 가고 semantic-a11y 서버를 거치지 않습니다. 사용량은 내 계정에 청구됩니다.</li>
          <li>
            "이 탭에 기억"을 끄면 메모리에만 있어 새로고침하면 사라집니다. 켜면 AES-GCM으로 암호화해 이 탭에 두고, 탭을 닫으면
            지워집니다. 이 사이트에서 실행되는 스크립트까지 막지는 못하니 공용 PC에서는 끄세요.
          </li>
          <li>Claude Pro·Max 구독은 API 키가 아니어서 API 크레딧이 따로 있어야 합니다. 구독만 있다면 "내 AI로 판정"을 쓰세요.</li>
        </ul>
      </details>
      {!vision && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950">
          이미지를 보내지 않으면 대체 텍스트(KWCAG 5.1.1) 판정이 불안정해서, 그 판정은 신뢰도를 낮춰 사람 확인으로 보냅니다.
        </p>
      )}
    </div>
  );
}
