import type { ImageAttachment } from '../candidate-images';
import { refusalError, truncatedError } from '../llm-error';
import { toImageLabel } from '../prompt';
import { parseJsonText, postJson, toBase64, toUsage, type LlmProvider } from './provider';

interface AnthropicResponse {
  content?: { type?: string; text?: string }[];
  stop_reason?: string;
  usage?: { input_tokens?: unknown; output_tokens?: unknown };
}

function toContent(text: string, images: ImageAttachment[]) {
  const imageBlocks = images.flatMap((image) => [
    { type: 'text', text: toImageLabel(image.selector) },
    { type: 'image', source: { type: 'base64', media_type: 'image/png', data: toBase64(image.dataUrl) } },
  ]);
  return [{ type: 'text', text }, ...imageBlocks];
}

// 구조화 출력(output_config.format)으로 스키마에 맞는 JSON을 text 블록으로 받는다(2026-10 공식 문서 기준, 베타 헤더 불필요)
export const anthropicProvider: LlmProvider = {
  id: 'anthropic',
  async complete({ model, apiKey, system, text, images, schema }) {
    const headers = {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // 브라우저에서 직접 부르려면 이 헤더가 있어야 CORS가 열린다. 키는 사용자 것이고 우리 서버를 거치지 않는다
      'anthropic-dangerous-direct-browser-access': 'true',
    };
    const body = {
      model,
      max_tokens: 16_000,
      system,
      messages: [{ role: 'user', content: toContent(text, images) }],
      output_config: { format: { type: 'json_schema', schema } },
    };
    const data = (await postJson('https://api.anthropic.com/v1/messages', headers, body)) as AnthropicResponse;
    if (data.stop_reason === 'max_tokens') throw truncatedError();
    if (data.stop_reason === 'refusal') throw refusalError();
    const output = data.content?.find((block) => block.type === 'text')?.text;
    return { json: parseJsonText(output), usage: toUsage(data.usage?.input_tokens, data.usage?.output_tokens) };
  },
};
