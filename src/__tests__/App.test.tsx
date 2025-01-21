import { render, screen } from '@testing-library/react';
import App from '../App';
import {expect, test} from "vitest";

test('renders hello react', () => {
    render(<App />);
    const linkElement = screen.getByText(/Hello, React with TypeScript!/i);
    expect(linkElement).toBeInTheDocument();
});