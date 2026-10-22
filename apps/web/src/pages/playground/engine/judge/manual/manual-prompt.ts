import type { ImageAttachment } from '../candidate-images';
import { JUDGE_OUTPUT_SCHEMA } from '../judge-schema';
import type { LlmPayload } from '../llm-payload';

// 채팅 앱에는 이미지를 하나씩 끼워 넣기 어려워서, 화면에서 한 장으로 묶은 이미지의 번호로 선택자를 잇는다
function toImageSection(images: ImageAttachment[]): string {
  if (images.length === 0) return '## 이미지\n\n이번 요청에는 이미지를 첨부하지 않았다.';
  const lines = images.map((image, index) => `${index + 1}. ${image.selector}`);
  return [
    '## 첨부 이미지',
    '위 응답 규칙의 이미지 배치 대신 이 방식을 따른다. 후보 이미지를 번호를 붙여 이미지 한 장에 모아 함께 첨부했다. 번호와 선택자는 아래와 같다.',
    '첨부 이미지가 보이지 않으면 이미지 후보의 대체 텍스트(5.1.1) 판정 confidence를 0.69 이하로 적는다.',
    ...lines,
  ].join('\n');
}

// API의 구조화 출력 대신 글로 스키마를 건넨다. 채팅 답은 코드 블록에 싸이기 쉬워서 JSON만 쓰라고 못 박는다
function toAnswerSection(): string {
  return [
    '## 답하는 방법',
    '아래 JSON 스키마를 지키는 JSON 하나만 답한다. 코드 블록 표시나 설명 문장을 앞뒤에 붙이지 않는다.',
    JSON.stringify(JUDGE_OUTPUT_SCHEMA),
  ].join('\n\n');
}

export function buildManualPrompt({ system, text, images }: LlmPayload): string {
  return [system, '---', text, toImageSection(images), toAnswerSection()].join('\n\n');
}
