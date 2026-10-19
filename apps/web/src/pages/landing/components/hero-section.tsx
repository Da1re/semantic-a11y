import { Link } from 'react-router';

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold text-blue-700">KWCAG 2.2 · WCAG 기반</p>
        <h1 id="hero-title" className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          규칙 엔진이 못 보는 접근성 문제를
          <br />
          AI가 의미로 판정합니다
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-700">
          대체 텍스트가 이미지를 제대로 설명하는지, 링크 문구가 목적지를 알려 주는지, 색으로만 정보를 전달하지
          않는지. 자동 도구가 통과시킨 항목까지 다시 보고, 수정 코드와 함께 알려 줍니다.
        </p>
        <Link
          to="/playground"
          className="mt-8 inline-flex rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
        >
          플레이그라운드에서 해보기
        </Link>
      </div>
    </section>
  );
}
