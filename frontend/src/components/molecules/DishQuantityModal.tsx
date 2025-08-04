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

interface DishQuantityModalProps {
  open: boolean;
  dish: Dish | null;
  onAdd: (dish: Dish, multiplier: number) => void;
  onClose: () => void;
}

const DishQuantityModal: React.FC<DishQuantityModalProps> = ({ open, dish, onAdd, onClose }) => {
  const [multiplier, setMultiplier] = useState('');
  React.useEffect(() => {
    if (open) setMultiplier('');
  }, [open]);

  if (!open || !dish) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(multiplier);
    if (isNaN(value) || value <= 0) return;
    onAdd(dish, value);
    setMultiplier('');
  };

  return (
    <div className="fixed inset-0 bg-[#00000075] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Portions pour {dish.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Nombre de portions</label>
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="ex: 1.5"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-semibold"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default DishQuantityModal;
