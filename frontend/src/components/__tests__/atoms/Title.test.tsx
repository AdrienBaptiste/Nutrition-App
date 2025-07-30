import { render, screen } from '@testing-library/react';
import { expect, describe, it } from 'vitest';
import Title from '../../atoms/Title';

describe('Title', () => {
  it('affiche le texte et le niveau correct', () => {
    render(<Title level={2}>Mon titre</Title>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Mon titre');
  });

  it('utilise h1 par défaut', () => {
    render(<Title>Default H1</Title>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Default H1');
  });
});
