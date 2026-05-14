import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AppHeader } from './Header';

describe('AppHeader', () => {
  function renderHeader() {
    return render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    );
  }

  it('renders the ProTrack brand link pointing to /', () => {
    renderHeader();
    const brand = screen.getByRole('link', { name: /protrack/i });
    expect(brand).toBeTruthy();
    expect(brand.getAttribute('href')).toBe('/');
  });

  it('renders the Login button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /login/i })).toBeTruthy();
  });
});
