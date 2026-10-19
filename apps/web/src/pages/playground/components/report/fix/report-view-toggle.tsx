import { REPORT_VIEW, REPORT_VIEW_LABEL } from '../../../constants/report-view';
import { usePlaygroundStore } from '../../../store/use-playground-store';

export function ReportViewToggle() {
  const view = usePlaygroundStore((state) => state.view);
  const changeView = usePlaygroundStore((state) => state.changeView);

  return (
    <fieldset className="mt-3">
      <legend className="text-sm font-semibold">결과와 미리보기</legend>
      <div className="mt-1 flex flex-wrap gap-2">
        {Object.values(REPORT_VIEW).map((value) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm has-checked:border-blue-700 has-checked:bg-blue-50"
          >
            <input
              type="radio"
              name="report-view"
              value={value}
              checked={view === value}
              onChange={() => changeView(value)}
              className="size-4 accent-blue-700"
            />
            {REPORT_VIEW_LABEL[value].ko}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
