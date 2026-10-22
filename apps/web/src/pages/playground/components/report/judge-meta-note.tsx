import { LLM_PROVIDER, LLM_PROVIDER_LABEL } from '../../constants/llm-provider';
import { useCurrentAudit } from '../../hooks/use-current-audit';

const formatNumber = (value: number) => value.toLocaleString('ko-KR');

// 사용자 돈으로 도는 판정이라 무엇을 얼마나 보냈는지 보여 준다. 단가는 바뀌므로 금액이 아니라 토큰 수만 적는다
export function JudgeMetaNote() {
  const { data } = useCurrentAudit();
  const meta = data?.judgeMeta;
  if (!meta) return null;

  const { provider, model, usage, imagesSent, candidatesSent, rejected, droppedFixes, vision } = meta;
  // 내 AI는 어떤 모델을 썼는지, 토큰을 얼마나 썼는지 사용자의 AI 쪽에서만 알 수 있어서 적지 않는다
  const isManual = provider === LLM_PROVIDER.MANUAL;
  const imageText = isManual ? '(한 장으로 묶어 첨부)' : '보냄';
  const usageText = ` · 토큰 입력 ${formatNumber(usage.inputTokens)} / 출력 ${formatNumber(usage.outputTokens)}`;

  return (
    <div className="rounded-lg border border-slate-200 p-3 text-sm text-slate-800">
      <p>
        <strong>AI 판정:</strong> {LLM_PROVIDER_LABEL[provider].ko}
        {!isManual && (
          <>
            {' '}
            · <code>{model}</code>
          </>
        )}
      </p>
      <p className="mt-1">
        요소 {candidatesSent}개 · 이미지 {imagesSent}장 {imageText}
        {!isManual && usageText}
      </p>
      <p className="mt-1">
        AI 응답 중 형식 오류로 제외 {rejected.length}건 · 수정 코드만 제외 {droppedFixes}건
      </p>
      {!vision && (
        <p className="mt-2 rounded-md bg-amber-50 p-2 text-amber-950">
          이미지를 보내지 않아 대체 텍스트 판정이 불안정합니다. 이런 판정은 신뢰도를 낮춰 사람 확인 대상으로 보냈습니다.
        </p>
      )}
      {rejected.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer font-semibold">제외한 응답 보기</summary>
          <ul className="mt-1 list-disc pl-5">
            {rejected.map((item, index) => (
              <li key={`${item.selector}-${index}`}>
                <code>{item.selector || '(선택자 없음)'}</code>: {item.reason}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
