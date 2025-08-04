import React, { useState } from 'react';

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodSelectModalProps {
  open: boolean;
  foods: Food[];
  onSelect: (food: Food) => void;
  onClose: () => void;
}
// (Food est compatible avec CalculatorFood maintenant)

const FoodSelectModal: React.FC<FoodSelectModalProps> = ({ open, foods, onSelect, onClose }) => {
  const [search, setSearch] = useState('');

  if (!open) return null;

  const filtered = foods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-[#00000075] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Sélectionner un aliment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un aliment..."
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-gray-400 italic">Aucun aliment trouvé.</div>
          ) : (
            <ul>
              {filtered.map((food) => (
                <li key={food.id}>
                  <button
                    className="w-full text-left px-2 py-1 hover:bg-blue-50 rounded"
                    onClick={() => onSelect(food)}
                  >
                    {food.name}
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

export default FoodSelectModal;
