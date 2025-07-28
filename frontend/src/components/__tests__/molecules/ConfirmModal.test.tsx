import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../../molecules/ConfirmModal';
import { vi } from 'vitest';
import { expect, describe, it } from 'vitest';

describe('ConfirmModal', () => {
  it('affiche le titre, le message et les boutons', () => {
    render(
      <ConfirmModal
        open={true}
        onConfirm={() => {}}
        onCancel={() => {}}
        confirmLabel="Oui, confirmer"
        cancelLabel="Annuler"
      >
        <h2 data-testid="modal-title">Titre test</h2>
        <span>Êtes-vous sûr ?</span>
      </ConfirmModal>
    );
    expect(screen.getByRole('heading', { name: 'Titre test' })).toBeInTheDocument();
    expect(screen.getByText('Êtes-vous sûr ?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmer/i })).toBeInTheDocument();
  });

  it('appelle onConfirm et onCancel quand on clique', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmModal
        open={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmLabel="Oui, confirmer"
        cancelLabel="Annuler"
      >
        <h2>Test</h2>
        <span>Message</span>
      </ConfirmModal>
    );
    fireEvent.click(screen.getByRole('button', { name: /confirmer/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
