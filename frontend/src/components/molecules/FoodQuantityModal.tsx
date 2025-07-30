import React, { useState } from 'react';

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodQuantityModalProps {
  open: boolean;
  food: Food | null;
  onAdd: (food: Food, quantity: number) => void;
  onClose: () => void;
}
// (Food est compatible avec CalculatorFood maintenant)

const FoodQuantityModal: React.FC<FoodQuantityModalProps> = ({ open, food, onAdd, onClose }) => {
  const [quantity, setQuantity] = useState('');
  React.useEffect(() => { if (open) setQuantity(''); }, [open]);

  if (!open || !food) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(quantity);
    if (isNaN(value) || value <= 0) return;
    onAdd(food, value);
    setQuantity('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Quantité pour {food.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Quantité (en grammes)</label>
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="ex: 100.25"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoodQuantityModal;
