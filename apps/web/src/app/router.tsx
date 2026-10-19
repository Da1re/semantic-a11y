import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/app/layout/root-layout';
import { LandingPage } from '@/pages/landing';
import { PlaygroundPage, ReviewPage } from '@/pages/playground';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/playground', element: <PlaygroundPage /> },
      { path: '/playground/review', element: <ReviewPage /> },
    ],
  },
]);
