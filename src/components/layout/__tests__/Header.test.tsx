import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders the Pokédex title', () => {
    render(<Header />);
    const titleElement = screen.getByText(/Pokédex/i);
    expect(titleElement).toBeInTheDocument();
  });
});