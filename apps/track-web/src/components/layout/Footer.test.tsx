import { render, screen } from '@testing-library/react';

import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024 ProTrack Systems/)).toBeTruthy();
  });

  it('renders the Privacy, Terms and Support links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /privacy/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /terms/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /support/i })).toBeTruthy();
  });
});
