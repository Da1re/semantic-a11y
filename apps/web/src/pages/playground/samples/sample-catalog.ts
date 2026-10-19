import type { SampleId } from '../constants/sample';
import type { RawJudgementFile } from '../engine/judge/mock-judge';
import noticeJudgements from './notice/judgements.json';
import noticeHtml from './notice/page.html?raw';
import shopJudgements from './shop/judgements.json';
import shopHtml from './shop/page.html?raw';
import signupJudgements from './signup/judgements.json';
import signupHtml from './signup/page.html?raw';

export interface SampleEntry {
  site: string;
  summary: string;
  html: string;
  judgements: RawJudgementFile;
}

export const SAMPLE_CATALOG: Record<SampleId, SampleEntry> = {
  shop: {
    site: 'shop.example',
    summary: '상품 사진 대체 텍스트, 색으로만 표시한 선택 상태, 목적이 안 보이는 링크',
    html: shopHtml,
    judgements: shopJudgements,
  },
  signup: {
    site: 'trip.example',
    summary: 'placeholder만 있는 입력칸, 색으로만 알리는 필수·오류, 이미지 보안문자',
    html: signupHtml,
    judgements: signupJudgements,
  },
  notice: {
    site: 'city.example',
    summary: '차트 대체 텍스트, 제목 셀 없는 표, 자동 재생 영상, 본문 바로가기',
    html: noticeHtml,
    judgements: noticeJudgements,
  },
};
