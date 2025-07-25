import React, { useState, useEffect } from 'react';
import MainLayout from '../components/templates/MainLayout';
import Title from '../components/atoms/Title';
import FoodSelectModal from '../components/molecules/FoodSelectModal';
import DishSelectModal from '../components/molecules/DishSelectModal';
import FoodQuantityModal from '../components/molecules/FoodQuantityModal';
import DishQuantityModal from '../components/molecules/DishQuantityModal';
import { useAuth } from '../hooks/useAuth';
// Types pour un aliment et un plat
interface CalculatorFood {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
interface CalculatorDish {
  id: number;
  name: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface SelectedFood extends CalculatorFood {
  quantity: number; // en grammes
}
interface SelectedDish extends CalculatorDish {
  multiplier: number; // nombre de portions (ex: 1.3)
}

const CalculatorPage: React.FC = () => {
  const { jwt } = useAuth();
  const [foods, setFoods] = useState<CalculatorFood[]>([]);
  const [dishes, setDishes] = useState<CalculatorDish[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<SelectedDish[]>([]);

  // Modales
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [dishModalOpen, setDishModalOpen] = useState(false);
  const [foodQtyModalOpen, setFoodQtyModalOpen] = useState(false);
  const [dishQtyModalOpen, setDishQtyModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<CalculatorFood | null>(null);
  const [selectedDish, setSelectedDish] = useState<CalculatorDish | null>(null);

  // Plus besoin des quantités inline ni des handlers addFood/addDish
  // const [foodQuantities, setFoodQuantities] = useState<Record<number, number>>({}); // id -> g
  // const [dishQuantities, setDishQuantities] = useState<Record<number, number>>({}); // id -> portions

  const [loading, setLoading] = useState(true); // Affiché dans le rendu principal si true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jwt) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [foodsRes, dishesRes] = await Promise.all([
          fetch('http://localhost:8000/api/v1/foods', {
            headers: { Authorization: `Bearer ${jwt}` },
          }),
          fetch('http://localhost:8000/api/v1/dishes', {
            headers: { Authorization: `Bearer ${jwt}` },
          }),
        ]);
        const foodsData = await foodsRes.json();
        const dishesData = await dishesRes.json();
        setFoods(Array.isArray(foodsData) ? foodsData : foodsData.member || []);
        // Correction: fetch la nutrition réelle de chaque plat
        const dishesList = Array.isArray(dishesData) ? dishesData : dishesData.member || [];
        type APIDish = CalculatorDish & { '@id'?: string; id?: number };
const dishesWithNutrition = await Promise.all(
          dishesList.map(async (dish: APIDish) => {
            // Correction : parse id depuis @id si besoin
            const id = dish.id ?? (typeof dish['@id'] === 'string' ? Number(dish['@id'].split('/').pop()) : undefined);
            if (!id) return null;
            try {
              const res = await fetch(`http://localhost:8000/api/v1/dishes/${dish.id}/nutrition`, {
                headers: { Authorization: `Bearer ${jwt}` },
              });
              if (!res.ok) throw new Error('Erreur nutrition');
              const nutrition = await res.json();
              return {
                ...dish,
                nutrition: {
                  calories: nutrition.calories ?? 0,
                  protein: nutrition.protein ?? 0,
                  carbs: nutrition.carbs ?? 0,
                  fat: nutrition.fat ?? 0,
                },
              };
            } catch {
              return {
                ...dish,
                nutrition: {
                  calories: 0,
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                },
              };
            }
          })
        );
        setDishes(dishesWithNutrition);
      } catch {
        setError('Erreur lors du chargement des aliments/plats');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jwt]);

  // Calcul des totaux
  const totals = {
    calories:
      selectedFoods.reduce((sum: number, f: SelectedFood) => sum + (f.calories * f.quantity) / 100, 0) +
      selectedDishes.reduce((sum: number, d: SelectedDish) => sum + d.nutrition.calories * d.multiplier, 0),
    protein:
      selectedFoods.reduce((sum: number, f: SelectedFood) => sum + (f.protein * f.quantity) / 100, 0) +
      selectedDishes.reduce((sum: number, d: SelectedDish) => sum + d.nutrition.protein * d.multiplier, 0),
    carbs:
      selectedFoods.reduce((sum: number, f: SelectedFood) => sum + (f.carbs * f.quantity) / 100, 0) +
      selectedDishes.reduce((sum: number, d: SelectedDish) => sum + d.nutrition.carbs * d.multiplier, 0),
    fat:
      selectedFoods.reduce((sum: number, f: SelectedFood) => sum + (f.fat * f.quantity) / 100, 0) +
      selectedDishes.reduce((sum: number, d: SelectedDish) => sum + d.nutrition.fat * d.multiplier, 0),
  };

  // DEBUG LOGS
  console.log('[DEBUG] selectedFoods:', selectedFoods);
  console.log('[DEBUG] selectedDishes:', selectedDishes);
  console.log('[DEBUG] totals:', totals);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Title level={1} className="mb-8">Calculateur nutritionnel</Title>
        {loading && <div className="text-center text-gray-500 mb-4">Chargement...</div>}
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        {/* Boutons d'ajout */}
        <div className="flex gap-4 mb-8">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
            onClick={() => setFoodModalOpen(true)}
          >
            + Ajouter un aliment
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-semibold"
            onClick={() => setDishModalOpen(true)}
          >
            + Ajouter un plat
          </button>
        </div>
        {/* Cards des aliments/plats sélectionnés */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedFoods.map(f => (
            <div key={'f-' + f.id} className="bg-blue-50 rounded p-4 flex flex-col relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold focus:outline-none"
                title="Supprimer cet aliment"
                onClick={() => setSelectedFoods(prev => prev.filter(food => food.id !== f.id))}
                aria-label={`Supprimer ${f.name}`}
              >
                ×
              </button>
              <div className="font-semibold text-blue-800 text-lg">{f.name}</div>
              <div className="text-sm text-gray-600">Quantité : {f.quantity}g</div>
            </div>
          ))}
          {selectedDishes.map(d => (
            <div key={'d-' + d.id} className="bg-purple-50 rounded p-4 flex flex-col relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-xl font-bold focus:outline-none"
                title="Supprimer ce plat"
                onClick={() => setSelectedDishes(prev => prev.filter(dish => dish.id !== d.id))}
                aria-label={`Supprimer ${d.name}`}
              >
                ×
              </button>
              <div className="font-semibold text-purple-800 text-lg">{d.name}</div>
              <div className="text-sm text-gray-600">Portions : {d.multiplier}</div>
            </div>
          ))}
        </div>
        {/* Modales */}
        <FoodSelectModal
          open={foodModalOpen}
          foods={foods}
          onSelect={(food: CalculatorFood) => {
            // On force le typage complet CalculatorFood (avec macros)
            setSelectedFood(food as CalculatorFood);
            setFoodModalOpen(false);
            setTimeout(() => setFoodQtyModalOpen(true), 100); // pour éviter clignotement
          }}
          onClose={() => setFoodModalOpen(false)}
        />
        <FoodQuantityModal
          open={foodQtyModalOpen}
          food={selectedFood}
          onAdd={(food: CalculatorFood, quantity: number) => {
            // Merge tout le CalculatorFood pour garantir le typage
            setSelectedFoods(prev => [...prev, { ...food, quantity } as SelectedFood]);
            setFoodQtyModalOpen(false);
            setSelectedFood(null);
          }}
          onClose={() => {
            setFoodQtyModalOpen(false);
            setSelectedFood(null);
          }}
        />
        <DishSelectModal
          open={dishModalOpen}
          dishes={dishes}
          onSelect={(dish: CalculatorDish) => {
            setSelectedDish(dish);
            setDishModalOpen(false);
            setTimeout(() => setDishQtyModalOpen(true), 100);
          }}
          onClose={() => setDishModalOpen(false)}
        />
        <DishQuantityModal
          open={dishQtyModalOpen}
          dish={selectedDish}
          onAdd={(dish: CalculatorDish, multiplier: number) => {
            const added = {
              ...dish,
              nutrition: dish.nutrition ?? { calories: 0, protein: 0, carbs: 0, fat: 0 },
              multiplier,
            };
            console.log('[DEBUG] Plat ajouté à selectedDishes:', added);
            setSelectedDishes(prev => [
              ...prev,
              added,
            ]);
            setDishQtyModalOpen(false);
            setSelectedDish(null);
          }}
          onClose={() => {
            setDishQtyModalOpen(false);
            setSelectedDish(null);
          }}
        />
        {/* Sélection courante */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Sélection courante</h2>
          {selectedFoods.length === 0 && selectedDishes.length === 0 ? (
            <div className="text-gray-400 italic">Aucun aliment ou plat sélectionné.</div>
          ) : (
            <ul className="list-disc ml-8">
              {selectedFoods.map((f) => (
                <li key={'f-' + f.id}>
                  {f.name} — {f.quantity}g
                </li>
              ))}
              {selectedDishes.map((d) => (
                <li key={'d-' + d.id}>
                  {d.name} — {d.multiplier} portion(s)
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Macros totaux</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded p-4 text-center">
              <div className="text-xs text-gray-500">Calories</div>
              <div className="text-2xl font-bold text-blue-700">
                {totals.calories.toFixed(0)} kcal
              </div>
            </div>
            <div className="bg-green-50 rounded p-4 text-center">
              <div className="text-xs text-gray-500">Protéines</div>
              <div className="text-2xl font-bold text-green-700">{totals.protein.toFixed(1)} g</div>
            </div>
            <div className="bg-yellow-50 rounded p-4 text-center">
              <div className="text-xs text-gray-500">Glucides</div>
              <div className="text-2xl font-bold text-yellow-700">{totals.carbs.toFixed(1)} g</div>
            </div>
            <div className="bg-pink-50 rounded p-4 text-center">
              <div className="text-xs text-gray-500">Lipides</div>
              <div className="text-2xl font-bold text-pink-700">{totals.fat.toFixed(1)} g</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalculatorPage;
