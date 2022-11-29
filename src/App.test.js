import { render, screen } from '@testing-library/react';
import App from './App';
import './i18n';


test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Siirry headeriin/i);
  expect(linkElement).toBeInTheDocument();
});
