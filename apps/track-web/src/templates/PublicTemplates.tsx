import { Outlet } from 'react-router-dom';

import { Footer } from '../components/layout/Footer';
import { AppHeader } from '../components/layout/Header';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
