// 제공자 응답·검증 실패를 사용자에게 그대로 보여 줄 한국어 문장으로 정규화한다.
// 점검 실패 일반 문구로 덮으면 "키가 틀렸는지, 한도인지"를 알 수 없어서 따로 구분한다
export class LlmError extends Error {
  name = 'LlmError';
}

const MESSAGE_BY_STATUS: Record<number, string> = {
  400: '요청이 거절되었습니다',
  401: 'API 키를 확인해 주세요. 키가 틀렸거나 만료되었습니다.',
  402: '크레딧이 부족합니다. 제공자 계정에서 크레딧을 충전한 뒤 다시 시도해 주세요.',
  403: 'API 키에 이 모델을 쓸 권한이 없습니다. 키의 권한과 결제 상태를 확인해 주세요.',
  404: '모델을 찾을 수 없습니다. 모델 이름을 확인해 주세요.',
  413: '보낼 내용이 너무 큽니다. 이미지 전송을 끄거나 더 작은 페이지로 다시 시도해 주세요.',
  429: '요청 한도를 넘었거나 크레딧이 부족합니다. 잠시 후 다시 시도하거나 결제 상태를 확인해 주세요.',
};

// 제공자 메시지에는 키가 들어 있지 않지만, 길거나 영어라서 앞부분만 덧붙인다
function toDetail(body: unknown): string {
  const message = (body as { error?: { message?: unknown } } | null)?.error?.message;
  if (typeof message !== 'string' || message === '') return '';
  return ` (제공자 메시지: ${message.slice(0, 160)})`;
}

export function toHttpError(status: number, body: unknown): LlmError {
  const fallback = status >= 500 ? '제공자 서버가 응답하지 않습니다. 잠시 후 다시 시도해 주세요.' : `요청이 실패했습니다(HTTP ${status})`;
  const base = MESSAGE_BY_STATUS[status] ?? fallback;
  const withDetail = status === 401 ? base : `${base}${toDetail(body)}`;
  return new LlmError(withDetail);
}

export function networkError(): LlmError {
  return new LlmError(
    '제공자에 연결하지 못했습니다. 네트워크 연결을 확인하고, 광고 차단 같은 브라우저 확장 프로그램이 요청을 막지 않는지 확인해 주세요.',
  );
}

export function truncatedError(): LlmError {
  return new LlmError('AI 응답이 길이 제한에 걸려 잘렸습니다. 더 작은 페이지로 다시 시도해 주세요.');
}

export function refusalError(): LlmError {
  return new LlmError('모델이 이 요청의 판정을 거절했습니다. 다른 모델로 다시 시도해 주세요.');
}

export function formatError(): LlmError {
  return new LlmError('AI 응답이 약속한 JSON 형식이 아니어서 결과에 넣지 않았습니다. 다시 점검해 주세요.');
}
