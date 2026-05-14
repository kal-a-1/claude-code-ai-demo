import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

import { Header } from './Header';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Header', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the ProTrack brand link pointing to /', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const brand = screen.getByRole('link', { name: /protrack/i });
    expect(brand).toBeTruthy();
    expect(brand.getAttribute('href')).toBe('/');
  });

  it('renders the Login button', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: /login/i })).toBeTruthy();
  });

  it('navigates to /login when Login button is clicked', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
