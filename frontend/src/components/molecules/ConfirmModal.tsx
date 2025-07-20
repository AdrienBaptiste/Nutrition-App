import React from 'react';

interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onConfirm, onCancel, children, confirmLabel = 'Oui, confirmer', cancelLabel = 'Annuler' }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'gray',
          borderRadius: 8,
          padding: 24,
          minWidth: 300,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        }}
      >
        <div className="mb-4">{children}</div>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
