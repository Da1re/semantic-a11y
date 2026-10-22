import { useId, useState } from 'react';
import { useRestoreAiConnection } from '../../hooks/use-restore-ai-connection';
import { AiConnectionActions, type PanelView } from './ai-connection-actions';
import { AiConnectionForm } from './ai-connection-form';
import { AiConnectionSummary } from './ai-connection-summary';
import { AiSettingsForm } from './ai-settings-form';
import { ManualModeForm } from './manual/manual-mode-form';

// 평소에는 한 줄로 접어 두어 점검 화면을 밀어내지 않고, 판정 방식 선택·키 입력·설정은 누를 때만 펼친다
export function AiConnectionPanel() {
  useRestoreAiConnection();
  const [view, setView] = useState<PanelView>(null);
  const bodyId = useId();
  const close = () => setView(null);
  const toggle = (next: Exclude<PanelView, null>) => setView((current) => (current === next ? null : next));
  const body = {
    manual: <ManualModeForm onDone={close} />,
    key: <AiConnectionForm onDone={close} />,
    settings: <AiSettingsForm onDone={close} />,
  };

  return (
    <section aria-labelledby="ai-connection-title" className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-3.5">
        <h2 id="ai-connection-title" className="font-bold">
          AI 판정
        </h2>
        <AiConnectionSummary />
        <AiConnectionActions view={view} bodyId={bodyId} onToggle={toggle} onClose={close} />
      </div>
      <div id={bodyId} hidden={view === null} className="border-t border-slate-200 px-5 py-4">
        {view && body[view]}
      </div>
    </section>
  );
}
