import { Route, Routes } from 'react-router-dom';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { PublicLayout } from '../templates/PublicLayout';

if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
  import('../../_mocks').catch((err) =>
    console.error('MSW failed to start', err),
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
