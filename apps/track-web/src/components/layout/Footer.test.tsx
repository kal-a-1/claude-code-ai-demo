import { render, screen } from '@testing-library/react';

import { Footer } from './Footer';

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024 ProTrack Systems/i)).toBeTruthy();
  });

  it('renders Privacy link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /privacy/i })).toBeTruthy();
  });

  it('renders Terms link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /terms/i })).toBeTruthy();
  });

  it('renders Support link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /support/i })).toBeTruthy();
  });
});
