export const LLM_PROVIDER = {
  ANTHROPIC: 'anthropic',
  OPENAI: 'openai',
  /** 내 AI(Claude 앱 등)에 요청을 직접 붙여 넣고 받은 답을 가져오는 방식. 키·결제가 없다 */
  MANUAL: 'manual',
} as const;

export type LlmProviderId = (typeof LLM_PROVIDER)[keyof typeof LLM_PROVIDER];

/** 브라우저가 API를 직접 부르는 제공자 */
export type ApiProviderId = Exclude<LlmProviderId, 'manual'>;

export const LLM_PROVIDER_LABEL: Record<LlmProviderId, { ko: string; en: string }> = {
  anthropic: { ko: 'Anthropic (Claude)', en: 'Anthropic (Claude)' },
  openai: { ko: 'OpenAI (GPT)', en: 'OpenAI (GPT)' },
  manual: { ko: '내 AI(복사·붙여넣기)', en: 'My AI (copy & paste)' },
};

/** 내 AI는 모델을 사용자가 그쪽에서 고르므로 이름표만 둔다 */
export const MANUAL_MODEL = 'my-ai';

export interface LlmModelPreset {
  id: string;
  note: string;
}

// 2026-10-21 각 제공자 공식 모델 목록에서 이미지 입력·구조화 출력을 지원하는 것만 골랐다.
// 첫 항목이 기본값이다. OpenAI 목록은 웹에서 쓰지 않고(브라우저 CORS 차단) CLI 단계에서 쓴다.
// 목록에 없는 모델 id도 직접 입력할 수 있어서, 모델이 바뀌어도 코드를 고치지 않고 쓸 수 있다
export const LLM_MODEL_PRESET: Record<LlmProviderId, readonly LlmModelPreset[]> = {
  anthropic: [
    { id: 'claude-sonnet-5-5', note: '기본' },
    { id: 'claude-haiku-5-5', note: '빠르고 저렴' },
    { id: 'claude-opus-5-5', note: '가장 정확' },
  ],
  openai: [
    { id: 'gpt-6.1-sol', note: '기본' },
    { id: 'gpt-6-luna', note: '빠르고 저렴' },
  ],
  manual: [{ id: MANUAL_MODEL, note: '내 AI' }],
};
