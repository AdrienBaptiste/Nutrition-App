import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';

import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

interface Dish {
  id: number;
  name: string;
  description?: string;
}

interface Food {
  id: number;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

interface Contain {
  id: number;
  food: Food;
  quantity: number;
}

interface AddFoodFormInputs {
  foodId: number;
  quantity: number;
}

const ComposeDishPage: React.FC = () => {
  const [nutrition, setNutrition] = useState<{calories: number, protein: number, carbs: number, fat: number} | null>(null);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutritionError, setNutritionError] = useState<string | null>(null);

  const { jwt } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [dish, setDish] = useState<Dish | null>(null);
  const [contains, setContains] = useState<Contain[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingFood, setAddingFood] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddFoodFormInputs>();

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !jwt) {
        setError('ID du plat manquant ou utilisateur non authentifié');
        setLoading(false);
        return;
      }

      try {
        // Récupérer les informations du plat
        const dishResponse = await fetch(`http://localhost:8000/api/v1/dishes/${id}`, {
          headers: { 'Authorization': `Bearer ${jwt}` },
        });

        if (!dishResponse.ok) {
          throw new Error('Impossible de charger le plat');
        }

        const dishData = await dishResponse.json();
        setDish(dishData);

        // Vérifier si le plat récupéré contient déjà sa composition
        if (dishData.contains && dishData.contains.length > 0) {
          console.log('Composition from dish:', dishData.contains); // Debug temporaire
          setContains(dishData.contains);
        } else {
          console.log('No composition in dish data, fetching separately...'); // Debug temporaire
          // Récupérer la composition du plat (contains) séparément
          const containsResponse = await fetch(`http://localhost:8000/api/v1/contains`, {
            headers: { 'Authorization': `Bearer ${jwt}` },
          });

          if (containsResponse.ok) {
            const containsData = await containsResponse.json();
            const dishContains = Array.isArray(containsData) ? containsData : (containsData.member || []);
            // Filtrer pour ne garder que les contains de ce plat
            // API Platform retourne dish comme IRI ("/api/v1/dishes/6") au lieu d'un objet
            const filteredContains = dishContains.filter((contain: { dish: string | { id: number }, food: string | { id: number }, quantity: number, id: number }) => {
              const dishIri = contain.dish;
              if (typeof dishIri === 'string') {
                // Extraire l'ID depuis l'IRI "/api/v1/dishes/6" -> "6"
                const dishIdMatch = dishIri.match(/\/dishes\/(\d+)$/);
                const dishId = dishIdMatch ? parseInt(dishIdMatch[1]) : null;
                return dishId === parseInt(id);
              }
              // Si c'est un objet (cas rare)
              return dishIri?.id === parseInt(id);
            });
            console.log('Filtered contains for dish', id, ':', filteredContains); // Debug temporaire
            
            // Récupérer les données complètes des aliments pour chaque contain
            const containsWithFoodData = await Promise.all(
              filteredContains.map(async (contain: { dish: string | { id: number }, food: string | { id: number }, quantity: number, id: number }) => {
                const foodIri = contain.food;
                if (typeof foodIri === 'string') {
                  // Récupérer les données complètes de l'aliment
                  const foodResponse = await fetch(`http://localhost:8000${foodIri}`, {
                    headers: { 'Authorization': `Bearer ${jwt}` },
                  });
                  if (foodResponse.ok) {
                    const foodData = await foodResponse.json();
                    return { ...contain, food: foodData };
                  }
                }
                return contain;
              })
            );
            
            setContains(containsWithFoodData);
          }
        }

        // Récupérer la liste des aliments disponibles
        const foodsResponse = await fetch(`http://localhost:8000/api/v1/foods`, {
          headers: { 'Authorization': `Bearer ${jwt}` },
        });

        if (foodsResponse.ok) {
          const foodsData = await foodsResponse.json();
          const foodsList = Array.isArray(foodsData) ? foodsData : (foodsData.member || []);
          setFoods(foodsList);
        }

      } catch {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, jwt]);

  useEffect(() => {
    if (!id || !jwt) return;
    setNutritionLoading(true);
    fetch(`http://localhost:8000/api/v1/dishes/${id}/nutrition`, {
      headers: { 'Authorization': `Bearer ${jwt}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement du résumé nutritionnel');
        return res.json();
      })
      .then(setNutrition)
      .catch(() => setNutritionError('Erreur lors du chargement du résumé nutritionnel'))
      .finally(() => setNutritionLoading(false));
  }, [id, jwt, contains]);

  const onAddFood = async (data: AddFoodFormInputs) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/contains', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dish: `/api/v1/dishes/${id}`,
          food: `/api/v1/foods/${data.foodId}`,
          quantity: data.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'aliment');
      }

      const newContain = await response.json();
      
      // Trouver l'aliment correspondant pour l'affichage
      const food = foods.find(f => f.id === data.foodId);
      if (food) {
        setContains([...contains, { ...newContain, food }]);
      }
      
      reset();
      setAddingFood(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'aliment');
    }
  };

  const handleRemoveFood = async (containId: number) => {
    if (!confirm('Supprimer cet aliment du plat ?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/contains/${containId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${jwt}` },
      });

      if (response.ok) {
        setContains(contains.filter(c => c.id !== containId));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch {
      alert('Erreur réseau lors de la suppression');
    }
  };

  const handleDeleteDish = async () => {
    if (!confirm('Supprimer définitivement ce plat et sa composition ?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/dishes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${jwt}` },
      });

      if (response.ok) {
        navigate('/dishes');
      } else {
        alert('Erreur lors de la suppression du plat');
      }
    } catch {
      alert('Erreur réseau lors de la suppression');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement de la composition..." />
        </div>
      </MainLayout>
    );
  }

  if (error || !dish) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p>{error || 'Plat non trouvé'}</p>
            <button
              onClick={() => navigate('/dishes')}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Retour aux plats
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Composition : {dish.name}</h1>
              {dish.description && (
                <p className="text-gray-600">{dish.description}</p>
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/dishes/${id}/edit`}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Modifier le plat
              </Link>
              <button
                onClick={handleDeleteDish}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Supprimer le plat
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Composition actuelle */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Composition actuelle</h2>
              
              {contains.length === 0 ? (
                <Card>
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun aliment dans ce plat</p>
                    <p className="text-sm mt-2">Ajoutez des aliments pour composer votre plat</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {contains.map((contain) => (
                    <Card key={contain.id}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">{contain.food.name}</h3>
                          <p className="text-sm text-gray-600">{contain.quantity}g</p>
                          <p className="text-xs text-gray-500">
                            {Math.round((contain.food.calories * contain.quantity) / 100)} kcal
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFood(contain.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Ajouter un aliment */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un aliment</h2>
              
              {!addingFood ? (
                <Card>
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Ajoutez des aliments à votre plat</p>
                    <Button onClick={() => setAddingFood(true)}>
                      Ajouter un aliment
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card>
                  <form onSubmit={handleSubmit(onAddFood)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aliment
                      </label>
                      <select
                        {...register('foodId', { 
                          required: 'Sélectionnez un aliment',
                          valueAsNumber: true 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Choisir un aliment...</option>
                        {foods.map((food) => (
                          <option key={food.id} value={food.id}>
                            {food.name} ({food.calories} kcal/100g)
                          </option>
                        ))}
                      </select>
                      {errors.foodId && (
                        <p className="text-red-600 text-sm mt-1">{errors.foodId.message}</p>
                      )}
                    </div>

                    <Input
                      label="Quantité (g)"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="Ex: 100.5"
                      {...register('quantity', { 
                        required: 'La quantité est requise',
                        min: { value: 0.1, message: 'Minimum 0.1g' },
                        valueAsNumber: true
                      })}
                      error={errors.quantity?.message}
                    />

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setAddingFood(false);
                          reset();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                      >
                        Annuler
                      </button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Ajout...' : 'Ajouter'}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-between">
            <Link
              to="/dishes"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              ← Retour aux plats
            </Link>
            
            {/* Résumé nutritionnel du plat */}
            {contains.length > 0 && (
              <div className="my-4">
                <h2 className="text-lg font-semibold mb-2">Résumé nutritionnel du plat</h2>
                {nutritionLoading ? (
                  <div className="text-gray-500">Chargement du résumé nutritionnel...</div>
                ) : nutritionError ? (
                  <div className="text-red-600">{nutritionError}</div>
                ) : nutrition ? (
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><strong>Calories :</strong> {nutrition.calories} kcal</div>
                    <div><strong>Protéines :</strong> {nutrition.protein} g</div>
                    <div><strong>Glucides :</strong> {nutrition.carbs} g</div>
                    <div><strong>Lipides :</strong> {nutrition.fat} g</div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComposeDishPage;
