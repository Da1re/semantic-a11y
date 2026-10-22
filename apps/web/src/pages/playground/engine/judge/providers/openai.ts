import type { ImageAttachment } from '../candidate-images';
import { refusalError, truncatedError } from '../llm-error';
import { toImageLabel } from '../prompt';
import { parseJsonText, postJson, toUsage, type LlmProvider } from './provider';

interface OpenAiResponse {
  status?: string;
  incomplete_details?: { reason?: string } | null;
  output?: { type?: string; content?: { type?: string; text?: string }[] }[];
  usage?: { input_tokens?: unknown; output_tokens?: unknown };
}

function toContent(text: string, images: ImageAttachment[]) {
  const imageParts = images.flatMap((image) => [
    { type: 'input_text', text: toImageLabel(image.selector) },
    { type: 'input_image', image_url: image.dataUrl, detail: 'auto' },
  ]);
  return [{ type: 'input_text', text }, ...imageParts];
}

// Responses API의 Structured Outputs(text.format, strict)로 스키마를 강제한다.
// 브라우저에서는 OpenAI가 POST 요청을 CORS로 막아 웹 화면에서는 고를 수 없고, 2단계 CLI(Node)에서 쓴다
export const openaiProvider: LlmProvider = {
  id: 'openai',
  async complete({ model, apiKey, system, text, images, schema }) {
    const body = {
      model,
      // 점검할 페이지 내용이 제공자 쪽에 대화 기록으로 남지 않게 한다
      store: false,
      // 추론 모델은 생각하는 토큰도 이 한도에 들어가서 Anthropic보다 넉넉히 둔다
      max_output_tokens: 32_000,
      instructions: system,
      input: [{ role: 'user', content: toContent(text, images) }],
      text: { format: { type: 'json_schema', name: 'judgements', schema, strict: true } },
    };
    const headers = { authorization: `Bearer ${apiKey}` };
    const data = (await postJson('https://api.openai.com/v1/responses', headers, body)) as OpenAiResponse;
    if (data.status === 'incomplete' && data.incomplete_details?.reason === 'max_output_tokens') throw truncatedError();
    const parts = (data.output ?? []).filter((item) => item.type === 'message').flatMap((item) => item.content ?? []);
    if (parts.some((part) => part.type === 'refusal')) throw refusalError();
    const output = parts.find((part) => part.type === 'output_text')?.text;
    return { json: parseJsonText(output), usage: toUsage(data.usage?.input_tokens, data.usage?.output_tokens) };
  },
};
