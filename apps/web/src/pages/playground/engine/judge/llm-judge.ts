import type { ApiProviderId } from '../../constants/llm-provider';
import type { Judge, JudgeInput, JudgeOutput } from './judge';
import { JUDGE_OUTPUT_SCHEMA } from './judge-schema';
import { prepareLlmPayload, toLlmJudgeOutput } from './llm-payload';
import { anthropicProvider } from './providers/anthropic';
import { openaiProvider } from './providers/openai';
import type { LlmProvider } from './providers/provider';

export interface LlmJudgeOptions {
  provider: ApiProviderId;
  model: string;
  apiKey: string;
  vision: boolean;
}

const PROVIDERS: Record<ApiProviderId, LlmProvider> = {
  anthropic: anthropicProvider,
  openai: openaiProvider,
};

async function runLlmJudge(input: JudgeInput, options: LlmJudgeOptions): Promise<JudgeOutput> {
  const payload = prepareLlmPayload(input, options.vision);
  const { json, usage } = await PROVIDERS[options.provider].complete({
    model: options.model,
    apiKey: options.apiKey,
    system: payload.system,
    text: payload.text,
    images: payload.images,
    schema: JUDGE_OUTPUT_SCHEMA,
  });
  return toLlmJudgeOutput(input, payload, json, usage, { provider: options.provider, model: options.model, vision: options.vision });
}

export function createLlmJudge(options: LlmJudgeOptions): Judge {
  return { mode: 'llm', judge: (input) => runLlmJudge(input, options) };
}
