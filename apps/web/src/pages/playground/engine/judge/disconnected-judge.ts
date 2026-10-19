import type { Judge } from './judge';

// 붙여 넣은 HTML은 미리 준비한 판정이 없다. 지어내지 않고 빈 결과를 돌려 규칙(axe) 결과만 남긴다
export function createDisconnectedJudge(): Judge {
  return {
    mode: 'disconnected',
    judge: async () => ({ judgements: [], ruleFixes: [] }),
  };
}
