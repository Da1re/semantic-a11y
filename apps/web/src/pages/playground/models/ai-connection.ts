import { LLM_MODEL_PRESET, LLM_PROVIDER, type LlmProviderId } from '../constants/llm-provider';
import type { LlmTarget } from './audit-target';

export interface AiConnection {
  provider: LlmProviderId;
  model: string;
  apiKey: string;
  vision: boolean;
  remember: boolean;
}

/** 목록에서 고르거나(modelChoice) "직접 입력"을 골라 customModel에 적는다 */
export interface AiConnectionFormValues {
  provider: LlmProviderId;
  modelChoice: string;
  customModel: string;
  apiKey: string;
  vision: boolean;
  remember: boolean;
}

export const CUSTOM_MODEL = 'custom';

export function isLlmProviderId(value: unknown): value is LlmProviderId {
  return Object.values(LLM_PROVIDER).some((id) => id === value);
}

export function toDefaultModel(provider: LlmProviderId): string {
  return LLM_MODEL_PRESET[provider][0]?.id ?? '';
}

export function toConnectionFormValues(connection: AiConnection | null): AiConnectionFormValues {
  if (!connection) {
    return { provider: 'anthropic', modelChoice: toDefaultModel('anthropic'), customModel: '', apiKey: '', vision: true, remember: false };
  }
  const isPreset = LLM_MODEL_PRESET[connection.provider].some((preset) => preset.id === connection.model);
  return {
    ...connection,
    modelChoice: isPreset ? connection.model : CUSTOM_MODEL,
    customModel: isPreset ? '' : connection.model,
  };
}

export function toAiConnection({ modelChoice, customModel, apiKey, ...rest }: AiConnectionFormValues): AiConnection {
  const model = modelChoice === CUSTOM_MODEL ? customModel.trim() : modelChoice;
  return { ...rest, model, apiKey: apiKey.trim() };
}

// 점검 대상에는 키를 빼고 담는다. 대상이 queryKey가 되기 때문이다
export function toLlmTarget(connection: AiConnection | null): LlmTarget | null {
  if (!connection) return null;
  return { provider: connection.provider, model: connection.model, vision: connection.vision, response: null };
}

// 내 AI는 키가 없어서 저장소에 기억할 것도 없다
export function toManualConnection(vision: boolean): AiConnection {
  return { provider: LLM_PROVIDER.MANUAL, model: toDefaultModel(LLM_PROVIDER.MANUAL), apiKey: '', vision, remember: false };
}

// 저장소에서 꺼낸 값은 다른 버전이 남긴 것일 수 있어서 모양을 확인한다
export function isAiConnection(value: unknown): value is AiConnection {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    isLlmProviderId(v.provider) &&
    typeof v.model === 'string' &&
    typeof v.apiKey === 'string' &&
    typeof v.vision === 'boolean' &&
    typeof v.remember === 'boolean'
  );
}
