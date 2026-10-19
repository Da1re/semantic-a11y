import type { Fix } from '../../../engine/types';
import { CodeBlock } from './code-block';
import { CopyFixButton } from './copy-fix-button';

interface FixSectionProps {
  fix?: Fix;
}

export function FixSection({ fix }: FixSectionProps) {
  if (!fix) return <p className="text-sm text-slate-600">이 항목에는 수정 코드 제안이 없습니다.</p>;

  return (
    <div className="space-y-2">
      <CodeBlock label="수정 전" code={fix.before} />
      <CodeBlock label="수정 후" code={fix.after} />
      <CopyFixButton code={fix.after} />
    </div>
  );
}
