export function PreviewPlaceholder() {
  return (
    <section aria-labelledby="preview-title" className="min-w-0">
      <h2 id="preview-title" className="text-lg font-bold">
        미리보기
      </h2>
      <div className="mt-4 flex min-h-[480px] items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-700">
        <p>
          HTML을 붙여 넣고 점검하기를 누르면, 스크립트를 정리한 HTML을 여기에 보여 주고 위반 위치를 표시합니다.
        </p>
      </div>
    </section>
  );
}
