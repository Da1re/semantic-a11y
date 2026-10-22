import type { JudgeMode } from '../engine/types';

// AI 판정이 없는 점검(미연결, 내 AI 답 대기)에서 "AI 위반 0"을 보이면 문제가 없다는 뜻으로 읽혀서 따로 구분한다
export function hasAiResult(mode: JudgeMode): boolean {
  return mode === 'mock' || mode === 'llm';
}
