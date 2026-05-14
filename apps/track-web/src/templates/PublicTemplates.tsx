import { Outlet } from 'react-router-dom';

import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
