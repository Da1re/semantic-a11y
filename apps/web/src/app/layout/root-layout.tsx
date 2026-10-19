import { Outlet } from 'react-router';
import { SiteFooter } from '@/app/layout/site-footer';
import { SiteHeader } from '@/app/layout/site-header';

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col break-keep bg-white text-slate-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-white"
      >
        본문 바로가기
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
