import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Footer } from './Footer';

describe('Footer', () => {
  function renderFooter() {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
  }

  it('renders the copyright text', () => {
    renderFooter();
    expect(screen.getByText(/© 2024 ProTrack Systems/i)).toBeTruthy();
  });

  it('renders the Privacy link', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: /privacy/i })).toBeTruthy();
  });

  it('renders the Terms link', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: /terms/i })).toBeTruthy();
  });

  it('renders the Support link', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: /support/i })).toBeTruthy();
  });
});
