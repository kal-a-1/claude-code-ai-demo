import { Route, Routes } from 'react-router-dom';

import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { PublicTemplates } from '../templates/PublicTemplates';

if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
  import('../../_mocks').catch((err) =>
    console.error('MSW failed to start', err),
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<PublicTemplates />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
