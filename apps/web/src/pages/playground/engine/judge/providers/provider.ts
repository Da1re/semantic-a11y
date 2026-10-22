import type { LlmProviderId } from '../../../constants/llm-provider';
import type { LlmUsage } from '../../types';
import type { ImageAttachment } from '../candidate-images';
import type { JudgeOutputSchema } from '../judge-schema';
import { formatError, networkError, toHttpError } from '../llm-error';

export interface LlmRequest {
  model: string;
  apiKey: string;
  system: string;
  text: string;
  images: ImageAttachment[];
  schema: JudgeOutputSchema;
}

export interface LlmResult {
  json: unknown;
  usage: LlmUsage;
}

/** 제공자를 늘릴 때(Gemini·로컬 모델) 이 모양만 맞추면 판정기·검증기는 그대로 쓴다 */
export interface LlmProvider {
  readonly id: LlmProviderId;
  complete(request: LlmRequest): Promise<LlmResult>;
}

async function readBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// SDK 없이 fetch만 쓴다. 의존성을 늘리지 않고, 키가 우리 서버를 거치지 않고 제공자에게만 가게 하려는 것이다
export async function postJson(url: string, headers: Record<string, string>, body: unknown): Promise<unknown> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  }).catch(() => {
    throw networkError();
  });
  const data = await readBody(response);
  if (!response.ok) throw toHttpError(response.status, data);
  return data;
}

export function parseJsonText(text: string | undefined): unknown {
  if (!text) throw formatError();
  try {
    return JSON.parse(text);
  } catch {
    throw formatError();
  }
}

export function toUsage(input: unknown, output: unknown): LlmUsage {
  return {
    inputTokens: typeof input === 'number' ? input : 0,
    outputTokens: typeof output === 'number' ? output : 0,
  };
}

export function toBase64(dataUrl: string): string {
  return dataUrl.slice(dataUrl.indexOf(',') + 1);
}
