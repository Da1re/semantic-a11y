import { REPORT_LOCALE, REPORT_LOCALE_LABEL } from '../../constants/report-locale';
import { usePlaygroundStore } from '../../store/use-playground-store';

export function ReportLocaleToggle() {
  const locale = usePlaygroundStore((state) => state.locale);
  const changeLocale = usePlaygroundStore((state) => state.changeLocale);

  return (
    <fieldset className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-slate-200 p-3">
      <legend className="px-1 text-sm font-semibold">리포트 언어</legend>
      {Object.values(REPORT_LOCALE).map((value) => (
        <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="radio"
            name="report-locale"
            value={value}
            checked={locale === value}
            onChange={() => changeLocale(value)}
            className="size-4 accent-blue-700"
          />
          {/* 언어 이름은 그 언어로 적어야 해당 언어 사용자가 바로 찾는다 */}
          <span lang={value}>{REPORT_LOCALE_LABEL[value][value]}</span>
        </label>
      ))}
    </fieldset>
  );
}
