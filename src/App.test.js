import { render, screen } from '@testing-library/react';
import App from './App';
import './locale/i18n';
import i18n from "i18next";

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Siirry headeriin/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders contact information on fi language', () => {
  render(<App />);
  const linkElement = screen.getByText(/Yhteystiedot/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveTextContent(/paikkatieto@vayla.fi/i);
});

test('renders contact information on sv language', () => {
  i18n.changeLanguage('sv')
  render(<App />);
  const linkElement = screen.getByText(/Kontaktinformation/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveTextContent(/paikkatieto@vayla.fi/i);
});


test('renders contact information on en language', () => {
  i18n.changeLanguage('en')
  render(<App />);
  const linkElement = screen.getAllByText(/Contact information/i)[0];
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveTextContent(/paikkatieto@vayla.fi/i);
});
