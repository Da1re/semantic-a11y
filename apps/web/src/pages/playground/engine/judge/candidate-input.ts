import type { KwcagId } from '../../constants/kwcag-catalog';
import { toSnippet } from '../snippet';
import { toUniqueSelector } from './unique-selector';

export type CandidateKind = 'image' | 'link' | 'control' | 'table' | 'media' | 'clickable' | 'page' | 'region' | 'text';

/** 이미지 후보만 쓴다. off는 사용자가 이미지 전송을 끈 것, unavailable은 이미지를 읽지 못한 것 */
export type CandidateImage = 'attached' | 'off' | 'unavailable';

export interface CandidateInput {
  selector: string;
  kind: CandidateKind;
  html: string;
  name: string;
  context: string;
  hints: KwcagId[];
  image?: CandidateImage;
}

const KIND_BY_TAG: Record<string, CandidateKind> = {
  title: 'page',
  img: 'image',
  a: 'link',
  button: 'control',
  input: 'control',
  select: 'control',
  textarea: 'control',
  table: 'table',
  video: 'media',
  audio: 'media',
  header: 'region',
};

// 모델이 모든 항목을 다 훑지 않고 요소마다 먼저 볼 항목을 알게 해서, 판정을 빠뜨리거나 엉뚱한 항목을 고르는 일을 줄인다
const HINTS_BY_KIND: Record<CandidateKind, KwcagId[]> = {
  image: ['5.1.1', '7.3.3'],
  link: ['6.4.3', '7.2.1'],
  control: ['7.3.2', '7.3.1', '5.3.3', '5.4.1', '7.2.1', '6.4.3'],
  table: ['5.3.1'],
  media: ['5.4.2', '5.2.1'],
  clickable: ['6.1.1'],
  page: ['6.4.2'],
  region: ['6.4.1'],
  text: ['5.4.1', '5.3.3'],
};

function normalize(text: string | null | undefined, limit: number): string {
  return (text ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
}

function toKind(el: Element): CandidateKind {
  if (el.getAttribute('role') === 'img') return 'image';
  return KIND_BY_TAG[el.tagName.toLowerCase()] ?? 'clickable';
}

function toLabelText(el: Element, doc: Document): string {
  if (!el.id) return '';
  return doc.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent ?? '';
}

// 화면낭독기가 읽을 이름에 가까운 값을 순서대로 고른다. 정확한 계산(accname)은 아니지만 판정 근거로는 충분하다
function toName(el: Element, doc: Document): string {
  const candidates = [
    el.getAttribute('aria-label'),
    el.getAttribute('alt'),
    toLabelText(el, doc),
    el.textContent,
    el.getAttribute('title'),
  ];
  return normalize(candidates.find((value) => normalize(value, 120) !== ''), 120);
}

// "자세히" 링크처럼 글자만으로는 목적지를 알 수 없는 요소가 많아서, 가장 가까운 제목과 주변 글을 함께 보낸다
function toContext(el: Element): string {
  const section = el.closest('section, article, fieldset, li, form, figure');
  const heading = section?.querySelector('h1, h2, h3, h4, h5, h6, legend, figcaption')?.textContent;
  const around = el.parentElement?.textContent;
  // 토큰을 아끼려고 문맥은 160자로 자른다
  const parts = [heading ? `[${normalize(heading, 60)}]` : '', normalize(around, 160)];
  return normalize(parts.join(' '), 160);
}

export function toCandidateInput(el: Element, doc: Document, kind: CandidateKind = toKind(el)): CandidateInput {
  return {
    selector: toUniqueSelector(el, doc),
    kind,
    html: toSnippet(el.outerHTML),
    name: toName(el, doc),
    context: toContext(el),
    hints: HINTS_BY_KIND[kind],
  };
}
