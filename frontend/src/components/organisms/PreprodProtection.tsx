import React, { useState } from 'react';

// Utilise la variable d'env pour le mot de passe (à définir sur Vercel)
const PASSWORD = import.meta.env.VITE_PREPROD_PASSWORD;


const PreprodProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem('preprod_unlocked') === '1';
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // Si la protection n'est pas activée, on affiche l'app normalement
  if (import.meta.env.VITE_PROTECTION_ENABLED !== 'true') {
    return <>{children}</>;
  }

  // Sécurité : si le mot de passe n'est pas défini, on bloque tout avec un message explicite
  if (!PASSWORD) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-red-600 font-bold">
          Erreur : VITE_PREPROD_PASSWORD n'est pas défini dans les variables d'environnement.<br />
          Veuillez contacter l'administrateur du site.
        </div>
      </div>
    );
  }

  // Si déjà déverrouillé pour la session, on affiche l'app
  if (unlocked) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem('preprod_unlocked', '1');
      setUnlocked(true);
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4 min-w-[320px]"
      >
        <h2 className="text-2xl font-bold mb-2">Accès protégé</h2>
        <p className="mb-2 text-gray-600">Ce site est réservé à l'équipe projet.</p>
        <input
          type="password"
          placeholder="Mot de passe"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
        >
          Entrer
        </button>
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      </form>
    </div>
  );
};

export default PreprodProtection;
