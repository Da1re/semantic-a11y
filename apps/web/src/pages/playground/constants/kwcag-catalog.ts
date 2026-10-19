export interface KwcagItem {
  ko: string;
  en: string;
  wcag: readonly string[];
}

// 번호는 국립전파연구원 표준 원문(5.1.1~8.2.1)을 따른다. 1.1.1식 번호를 쓰는 자료와 섞이지 않게 하기 위해서다
export const KWCAG = {
  '5.1.1': { ko: '적절한 대체 텍스트 제공', en: 'Appropriate text alternatives', wcag: ['1.1.1'] },
  '5.2.1': { ko: '자막 제공', en: 'Captions', wcag: ['1.2.1', '1.2.2', '1.2.3'] },
  '5.3.1': { ko: '표의 구성', en: 'Table structure', wcag: ['1.3.1'] },
  '5.3.2': { ko: '콘텐츠의 선형구조', en: 'Meaningful sequence', wcag: ['1.3.2'] },
  '5.3.3': { ko: '명확한 지시사항 제공', en: 'Clear instructions', wcag: ['1.3.3'] },
  '5.4.1': { ko: '색에 무관한 콘텐츠 인식', en: 'Use of color', wcag: ['1.4.1'] },
  '5.4.2': { ko: '자동 재생 금지', en: 'No autoplay', wcag: ['1.4.2'] },
  '5.4.3': { ko: '텍스트 콘텐츠의 명도 대비', en: 'Text contrast', wcag: ['1.4.3'] },
  '5.4.4': { ko: '콘텐츠 간의 구분', en: 'Content distinction', wcag: [] },
  '6.1.1': { ko: '키보드 사용 보장', en: 'Keyboard accessible', wcag: ['2.1.1'] },
  '6.1.2': { ko: '초점 이동과 표시', en: 'Focus order and visibility', wcag: ['2.4.3', '2.4.7'] },
  '6.1.3': { ko: '조작 가능', en: 'Operable target size', wcag: ['2.5.8'] },
  '6.1.4': { ko: '문자 단축키', en: 'Character key shortcuts', wcag: ['2.1.4'] },
  '6.2.1': { ko: '응답시간 조절', en: 'Timing adjustable', wcag: ['2.2.1'] },
  '6.2.2': { ko: '정지 기능 제공', en: 'Pause, stop, hide', wcag: ['2.2.2'] },
  '6.3.1': { ko: '깜빡임과 번쩍임 사용 제한', en: 'Three flashes', wcag: ['2.3.1'] },
  '6.4.1': { ko: '반복 영역 건너뛰기', en: 'Bypass blocks', wcag: ['2.4.1'] },
  '6.4.2': { ko: '제목 제공', en: 'Titles', wcag: ['2.4.2', '2.4.6'] },
  '6.4.3': { ko: '적절한 링크 텍스트', en: 'Link purpose', wcag: ['2.4.4'] },
  '6.4.4': { ko: '고정된 참조 위치 정보', en: 'Fixed reference location', wcag: [] },
  '6.5.1': { ko: '단일 포인터 입력 지원', en: 'Pointer gestures', wcag: ['2.5.1'] },
  '6.5.2': { ko: '포인터 입력 취소', en: 'Pointer cancellation', wcag: ['2.5.2'] },
  '6.5.3': { ko: '레이블과 네임', en: 'Label in name', wcag: ['2.5.3'] },
  '6.5.4': { ko: '동작기반 작동', en: 'Motion actuation', wcag: ['2.5.4'] },
  '7.1.1': { ko: '기본 언어 표시', en: 'Language of page', wcag: ['3.1.1'] },
  '7.2.1': { ko: '사용자 요구에 따른 실행', en: 'On focus and on input', wcag: ['3.2.1', '3.2.2'] },
  '7.2.2': { ko: '찾기 쉬운 도움 정보', en: 'Consistent help', wcag: ['3.2.6'] },
  '7.3.1': { ko: '오류 정정', en: 'Error identification and suggestion', wcag: ['3.3.1', '3.3.3'] },
  '7.3.2': { ko: '레이블 제공', en: 'Labels or instructions', wcag: ['3.3.2'] },
  '7.3.3': { ko: '접근 가능한 인증', en: 'Accessible authentication', wcag: ['3.3.8'] },
  '7.3.4': { ko: '반복 입력 정보', en: 'Redundant entry', wcag: ['3.3.7'] },
  '8.1.1': { ko: '마크업 오류 방지', en: 'Markup errors', wcag: ['4.1.1'] },
  '8.2.1': { ko: '웹 애플리케이션 접근성 준수', en: 'Name, role, value', wcag: ['4.1.2'] },
} as const satisfies Record<string, KwcagItem>;

export type KwcagId = keyof typeof KWCAG;
