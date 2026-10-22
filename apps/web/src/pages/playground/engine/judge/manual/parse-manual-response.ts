import { LlmError } from '../llm-error';

const NOT_FOUND = '붙여 넣은 글에서 JSON을 찾지 못했습니다. AI의 답을 처음부터 끝까지 그대로 붙여 넣어 주세요.';
const BROKEN = 'JSON을 읽지 못했습니다. 답이 중간에 잘렸다면 AI에게 이어서 써 달라고 한 뒤 이어 붙여 주세요.';

// 채팅 답은 코드 블록 표시나 앞뒤 설명이 붙기 쉬워서, 처음 { 부터 마지막 } 까지만 읽는다
function sliceJson(text: string): string | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

export function parseManualResponse(text: string): unknown {
  const sliced = sliceJson(text);
  if (sliced === null) throw new LlmError(NOT_FOUND);
  try {
    return JSON.parse(sliced);
  } catch {
    throw new LlmError(BROKEN);
  }
}

/** 입력칸 검사용. 읽을 수 있으면 null, 아니면 고칠 방법을 담은 문장 */
export function findManualResponseError(text: string): string | null {
  try {
    parseManualResponse(text);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : BROKEN;
  }
}
