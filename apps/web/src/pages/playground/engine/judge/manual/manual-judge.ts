import { LLM_PROVIDER, MANUAL_MODEL } from '../../../constants/llm-provider';
import type { Judge, JudgeInput, JudgeOutput } from '../judge';
import { prepareLlmPayload, toLlmJudgeOutput } from '../llm-payload';
import { buildManualPrompt } from './manual-prompt';
import { parseManualResponse } from './parse-manual-response';

export interface ManualJudgeOptions {
  vision: boolean;
  /** 내 AI에게서 받아 붙여 넣은 답. 아직 없으면 요청만 만든다 */
  response: string | null;
}

// 토큰 수는 사용자의 AI 쪽에서만 알 수 있어서 0으로 둔다(화면에는 싣지 않는다)
const NO_USAGE = { inputTokens: 0, outputTokens: 0 };

async function runManualJudge(input: JudgeInput, { vision, response }: ManualJudgeOptions): Promise<JudgeOutput> {
  const payload = prepareLlmPayload(input, vision);
  const manualRequest = { prompt: buildManualPrompt(payload), images: payload.images };
  if (response === null) return { judgements: [], ruleFixes: [], manualRequest };
  const json = parseManualResponse(response);
  const base = { provider: LLM_PROVIDER.MANUAL, model: MANUAL_MODEL, vision };
  return { ...toLlmJudgeOutput(input, payload, json, NO_USAGE, base), manualRequest };
}

// 같은 후보·같은 기준서·같은 검증기를 쓰고, 모델 호출만 사용자가 자기 AI에서 대신 한다
export function createManualJudge(options: ManualJudgeOptions): Judge {
  return { mode: options.response === null ? 'awaiting' : 'llm', judge: (input) => runManualJudge(input, options) };
}
