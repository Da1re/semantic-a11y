import type { LlmJudgeMeta, LlmUsage } from '../types';
import { attachImages, type ImageAttachment } from './candidate-images';
import type { CandidateInput } from './candidate-input';
import type { JudgeInput, JudgeOutput, Judgement } from './judge';
import { prepareJudgeRequest } from './judge-request';
import { LlmError } from './llm-error';
import { buildSystemPrompt, buildUserText } from './prompt';
import { validateJudgeOutput } from './validate-judge-output';

/** 모델에게 보낼 내용. API로 보내든 내 AI에 붙여 넣든 같은 것을 쓴다 */
export interface LlmPayload {
  candidates: CandidateInput[];
  images: ImageAttachment[];
  system: string;
  text: string;
}

export type LlmJudgeMetaBase = Pick<LlmJudgeMeta, 'provider' | 'model' | 'vision'>;

// 비용 상한. 이보다 많으면 보내지 않고 알린다(나눠 보내기는 다음 단계)
const CANDIDATE_LIMIT = 150;

export function prepareLlmPayload(input: JudgeInput, vision: boolean): LlmPayload {
  const { request, elements } = prepareJudgeRequest(input);
  const count = request.candidates.length;
  if (count > CANDIDATE_LIMIT) {
    throw new LlmError(`판정할 요소가 ${count}개로, 한 번에 보낼 수 있는 ${CANDIDATE_LIMIT}개를 넘습니다. 페이지 일부만 붙여 넣어 주세요.`);
  }
  const { candidates, images } = attachImages(request.candidates, elements, vision);
  return { candidates, images, system: buildSystemPrompt(), text: buildUserText({ ...request, candidates }) };
}

// 이미지를 보지 못한 대체 텍스트 판정은 alt 문구와 주변 글로 추측한 것이라, 모델이 확신해도 사람이 확인하게 한다.
// 신뢰도 0.7 미만은 사람 확인 대기열로 간다(to-ai-violations)
function capUnseenImage(judgement: Judgement, unseen: ReadonlySet<string>): Judgement {
  if (judgement.kwcag !== '5.1.1' || !unseen.has(judgement.selector)) return judgement;
  return { ...judgement, confidence: Math.min(judgement.confidence, 0.69) };
}

function toUnseenImages(candidates: CandidateInput[]): Set<string> {
  return new Set(candidates.filter((c) => c.kind === 'image' && c.image !== 'attached').map((c) => c.selector));
}

// 모델의 답은 어디서 왔든 같은 검증기를 거친 것만 리포트에 넣는다
export function toLlmJudgeOutput(input: JudgeInput, payload: LlmPayload, json: unknown, usage: LlmUsage, base: LlmJudgeMetaBase): JudgeOutput {
  const { candidates, images } = payload;
  const validated = validateJudgeOutput(json, {
    doc: input.doc,
    html: input.html,
    candidateSelectors: new Set(candidates.map((candidate) => candidate.selector)),
    ruleTargets: input.ruleViolations,
  });
  const unseen = toUnseenImages(candidates);
  return {
    judgements: validated.judgements.map((judgement) => capUnseenImage(judgement, unseen)),
    ruleFixes: validated.ruleFixes,
    meta: {
      ...base,
      imagesSent: images.length,
      candidatesSent: candidates.length,
      usage,
      rejected: validated.rejected,
      droppedFixes: validated.droppedFixes,
    },
  };
}
