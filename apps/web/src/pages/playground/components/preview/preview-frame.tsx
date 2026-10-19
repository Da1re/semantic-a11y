import { useState } from 'react';
import { usePreviewSource } from '../../hooks/use-preview-source';
import { OverlayLayer } from './overlay-layer';
import { PreviewPlaceholder } from './preview-placeholder';

export function PreviewFrame() {
  const preview = usePreviewSource();
  const [doc, setDoc] = useState<Document | null>(null);
  if (!preview) return <PreviewPlaceholder />;

  return (
    <section aria-labelledby="preview-title" className="min-w-0">
      <h2 id="preview-title" className="flex items-center gap-2 text-lg font-bold">
        미리보기
        {preview.isFixedView && (
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-sm font-semibold text-emerald-900">수정 후</span>
        )}
      </h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
        <div aria-hidden="true" className="flex items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-2">
          <span className="flex gap-1.5">
            <span className="size-3 rounded-full bg-slate-300" />
            <span className="size-3 rounded-full bg-slate-300" />
            <span className="size-3 rounded-full bg-slate-300" />
          </span>
          <span className="flex-1 truncate rounded-md bg-white px-3 py-1 text-sm text-slate-700">{preview.address}</span>
        </div>
        {/* 오버레이가 iframe 안 요소 위치를 읽어야 해서 같은 출처는 허용하고, 샘플 속 스크립트는 막는다 */}
        <iframe
          title={preview.title}
          srcDoc={preview.html}
          sandbox="allow-same-origin"
          onLoad={(event) => setDoc(event.currentTarget.contentDocument)}
          className="block h-[70vh] min-h-[480px] w-full"
        />
      </div>
      {doc && <OverlayLayer doc={doc} />}
    </section>
  );
}
