import { Link, NavLink } from 'react-router';

const NAV_ITEMS = [
  { to: '/playground', label: '플레이그라운드' },
  { to: '/playground/review', label: '검수 대기열' },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold tracking-tight">
          semantic-a11y
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="flex gap-6 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) => (isActive ? 'text-blue-700 underline underline-offset-4' : 'text-slate-700 hover:text-slate-950')}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
