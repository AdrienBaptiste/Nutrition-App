import React, { useState } from 'react';

interface Dish {
  id: number;
  name: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface DishSelectModalProps {
  open: boolean;
  dishes: Dish[];
  onSelect: (dish: Dish) => void;
  onClose: () => void;
}

const DishSelectModal: React.FC<DishSelectModalProps> = ({ open, dishes, onSelect, onClose }) => {
  const [search, setSearch] = useState('');

  if (!open) return null;

  const filtered = dishes.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Sélectionner un plat</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un plat..."
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-gray-400 italic">Aucun plat trouvé.</div>
          ) : (
            <ul>
              {filtered.map(dish => (
                <li key={dish.id}>
                  <button
                    className="w-full text-left px-2 py-1 hover:bg-purple-50 rounded"
                    onClick={() => onSelect(dish)}
                  >
                    {dish.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishSelectModal;
