import React, { useEffect, useState } from 'react';
import Card from '../components/atoms/Card';

interface ConstituteNutritionCardProps {
  constitute: any;
  jwt: string;
  onRemove?: () => void;
}

const ConstituteNutritionCard: React.FC<ConstituteNutritionCardProps> = ({ constitute, jwt, onRemove }) => {
  const [dishNutrition, setDishNutrition] = useState<null | {calories:number, protein:number, carbs:number, fat:number}>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si c'est un plat, on fetch la nutrition du plat
  useEffect(() => {
    if (constitute.dish && constitute.dish.id && constitute.dish_quantity) {
      setLoading(true);
      fetch(`http://localhost:8000/api/v1/dishes/${constitute.dish.id}/nutrition`, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Erreur lors du chargement du résumé nutritionnel du plat');
          return res.json();
        })
        .then(data => setDishNutrition(data))
        .catch(() => setError('Erreur lors du chargement du résumé nutritionnel du plat'))
        .finally(() => setLoading(false));
    }
  }, [constitute.dish, constitute.dish?.id, constitute.dish_quantity, jwt]);

  return (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            {constitute.food && (
              <>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Aliment</span>
                <h3 className="font-semibold text-gray-800">{constitute.food.name}</h3>
              </>
            )}
            {constitute.dish && (
              <>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Plat</span>
                <h3 className="font-semibold text-gray-800">{constitute.dish.name}</h3>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {constitute.food
              ? `${constitute.food_quantity}g`
              : `${constitute.dish_quantity} portion${(constitute.dish_quantity || 0) > 1 ? 's' : ''}`
            }
          </p>
          {/* Détail nutrition aliment */}
          {constitute.food && constitute.food_quantity && (
            <div className="text-xs text-gray-500 space-y-1 mt-1">
              <div><strong>Calories:</strong> {Math.round((constitute.food.calories * constitute.food_quantity) / 100)} kcal</div>
              <div><strong>Protéines:</strong> {((constitute.food.protein * constitute.food_quantity) / 100).toFixed(2)} g</div>
              <div><strong>Glucides:</strong> {((constitute.food.carbs * constitute.food_quantity) / 100).toFixed(2)} g</div>
              <div><strong>Lipides:</strong> {((constitute.food.fat * constitute.food_quantity) / 100).toFixed(2)} g</div>
            </div>
          )}
          {/* Détail nutrition plat (pour le nombre de portions) */}
          {constitute.dish && constitute.dish_quantity && (
            <div className="text-xs text-gray-500 space-y-1 mt-1">
              {loading && <div>Chargement nutrition du plat...</div>}
              {error && <div className="text-red-600">{error}</div>}
              {dishNutrition && (
                <>
                  <div><strong>Calories:</strong> {(dishNutrition.calories * constitute.dish_quantity).toFixed(0)} kcal</div>
                  <div><strong>Protéines:</strong> {(dishNutrition.protein * constitute.dish_quantity).toFixed(2)} g</div>
                  <div><strong>Glucides:</strong> {(dishNutrition.carbs * constitute.dish_quantity).toFixed(2)} g</div>
                  <div><strong>Lipides:</strong> {(dishNutrition.fat * constitute.dish_quantity).toFixed(2)} g</div>
                </>
              )}
            </div>
          )}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 text-sm ml-4"
          >
            Supprimer
          </button>
        )}
      </div>
    </Card>
  );
};

export default ConstituteNutritionCard;
