interface CodeBlockProps {
  label: string;
  code: string;
}

export function CodeBlock({ label, code }: CodeBlockProps) {
  return (
    <figure>
      <figcaption className="text-xs font-semibold text-slate-700">{label}</figcaption>
      {/* 좁은 결과 패널에서 가로 스크롤이 생기면 키보드로 내용을 읽기 어려워서 줄바꿈한다 */}
      <pre className="mt-1 rounded-md bg-slate-900 p-2 text-xs leading-relaxed break-all whitespace-pre-wrap text-slate-100">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
