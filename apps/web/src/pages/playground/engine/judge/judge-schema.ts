import { KWCAG } from '../../constants/kwcag-catalog';

// 판정과 규칙 위반이 같은 수정 코드 모양을 써야 적용 로직(apply-fixes)이 하나로 유지돼서 한 번만 정의한다(2곳 사용)
const FIX_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['before', 'after'],
  properties: {
    before: { type: 'string', description: '페이지 HTML에 정확히 한 번 나오는 원문. 수정이 없으면 빈 문자열' },
    after: { type: 'string', description: 'before를 고친 결과. 수정이 없으면 빈 문자열' },
  },
} as const;

// 두 제공자의 엄격 모드가 함께 받는 기능만 쓴다. 모든 속성을 required로 두고, 선택 값은 null 대신
// 'none'·빈 문자열로 받는다(Anthropic은 null 합집합 수에 상한이 있고 minimum·maximum을 받지 않는다).
// 범위·존재 여부 같은 나머지 조건은 검증기가 확인한다
export const JUDGE_OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['judgements', 'ruleFixes'],
  properties: {
    judgements: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['selector', 'kwcag', 'verdict', 'confidence', 'severity', 'reason', 'fix'],
        properties: {
          selector: { type: 'string', description: 'candidates에 있는 selector를 그대로' },
          kwcag: { type: 'string', enum: Object.keys(KWCAG) },
          verdict: { type: 'string', enum: ['pass', 'fail'] },
          confidence: { type: 'number', description: '0~1' },
          severity: { type: 'string', enum: ['critical', 'serious', 'moderate', 'none'] },
          reason: {
            type: 'object',
            additionalProperties: false,
            required: ['ko', 'en'],
            properties: { ko: { type: 'string' }, en: { type: 'string' } },
          },
          fix: FIX_SCHEMA,
        },
      },
    },
    ruleFixes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['selector', 'ruleId', 'fix'],
        properties: {
          selector: { type: 'string', description: 'ruleViolations에 있는 selector를 그대로' },
          ruleId: { type: 'string' },
          fix: FIX_SCHEMA,
        },
      },
    },
  },
} as const;

export type JudgeOutputSchema = typeof JUDGE_OUTPUT_SCHEMA;
