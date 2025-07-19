import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

interface Meal {
  id: number;
  name: string;
  description?: string;
  date: string;
}

interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Dish {
  id: number;
  name: string;
  description?: string;
}

interface Constitute {
  id: number;
  food?: Food;
  dish?: Dish;
  food_quantity?: number;
  dish_quantity?: number;
}

interface AddItemFormInputs {
  itemType: 'food' | 'dish';
  itemId: number;
  quantity: number;
}

const ComposeMealPage: React.FC = () => {
  const { jwt } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [constitutes, setConstitutes] = useState<Constitute[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingItem, setAddingItem] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddItemFormInputs>();

  const itemType = watch('itemType');

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !jwt) {
        setError('ID du repas manquant ou utilisateur non authentifié');
        setLoading(false);
        return;
      }

      try {
        // Récupérer les informations du repas
        const mealResponse = await fetch(`http://localhost:8000/api/v1/meals/${id}`, {
          headers: { 'Authorization': `Bearer ${jwt}` },
        });

        if (!mealResponse.ok) {
          throw new Error('Impossible de charger le repas');
        }

        const mealData = await mealResponse.json();
        setMeal(mealData);

        // Récupérer la composition du repas (constitutes)
        const constitutesResponse = await fetch(`http://localhost:8000/api/v1/constitutes`, {
          headers: { 'Authorization': `Bearer ${jwt}` },
        });

        if (constitutesResponse.ok) {
          const constitutesData = await constitutesResponse.json();
          const mealConstitutes = Array.isArray(constitutesData) ? constitutesData : (constitutesData.member || []);
          
          // Filtrer pour ne garder que les constitutes de ce repas et récupérer les données complètes
          const filteredConstitutes = mealConstitutes.filter((constitute: { meal: string | { id: number }, food?: string | { id: number }, dish?: string | { id: number }, food_quantity?: number, dish_quantity?: number, id: number }) => {
            const mealIri = constitute.meal;
            if (typeof mealIri === 'string') {
              const mealIdMatch = mealIri.match(/\/meals\/(\d+)$/);
              const mealId = mealIdMatch ? parseInt(mealIdMatch[1]) : null;
              return mealId === parseInt(id);
            }
            return mealIri?.id === parseInt(id);
          });

          // Récupérer les données complètes des aliments et plats
          const constitutesWithData = await Promise.all(
            filteredConstitutes.map(async (constitute: { '@id'?: string, id?: number, meal: string | { id: number }, food?: string | { id: number }, dish?: string | { id: number }, food_quantity?: number, dish_quantity?: number }) => {
              // Extraire l'ID depuis @id (format API Platform JSON-LD)
              let id = constitute.id;
              if (!id && constitute['@id']) {
                const idMatch = constitute['@id'].match(/\/constitutes\/(\d+)$/);
                id = idMatch ? parseInt(idMatch[1]) : undefined;
              }
              
              const result = { ...constitute, id };
              
              // Si c'est un aliment
              if (constitute.food && typeof constitute.food === 'string') {
                const foodResponse = await fetch(`http://localhost:8000${constitute.food}`, {
                  headers: { 'Authorization': `Bearer ${jwt}` },
                });
                if (foodResponse.ok) {
                  result.food = await foodResponse.json();
                }
              }
              
              // Si c'est un plat
              if (constitute.dish && typeof constitute.dish === 'string') {
                const dishResponse = await fetch(`http://localhost:8000${constitute.dish}`, {
                  headers: { 'Authorization': `Bearer ${jwt}` },
                });
                if (dishResponse.ok) {
                  result.dish = await dishResponse.json();
                }
              }
              
              return result;
            })
          );
          
          console.log('Constitutes chargés:', constitutesWithData);
          console.log('Premier constitute détaillé:', constitutesWithData[0]);
          console.log('IDs des constitutes:', constitutesWithData.map(c => ({ id: c.id, keys: Object.keys(c) })));
          setConstitutes(constitutesWithData);
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

        // Récupérer la liste des plats disponibles
        const dishesResponse = await fetch(`http://localhost:8000/api/v1/dishes`, {
          headers: { 'Authorization': `Bearer ${jwt}` },
        });

        if (dishesResponse.ok) {
          const dishesData = await dishesResponse.json();
          const dishesList = Array.isArray(dishesData) ? dishesData : (dishesData.member || []);
          setDishes(dishesList);
        }

      } catch {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, jwt]);

  const onAddItem = async (data: AddItemFormInputs) => {
    try {
      const body: { meal: string, food?: string, dish?: string, food_quantity?: number, dish_quantity?: number } = {
        meal: `/api/v1/meals/${id}`,
      };

      if (data.itemType === 'food') {
        body.food = `/api/v1/foods/${data.itemId}`;
        body.food_quantity = data.quantity;
      } else {
        body.dish = `/api/v1/dishes/${data.itemId}`;
        body.dish_quantity = data.quantity;
      }

      const response = await fetch('http://localhost:8000/api/v1/constitutes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'élément');
      }

      const newConstitute = await response.json();
      
      // Trouver l'aliment ou le plat correspondant pour l'affichage
      if (data.itemType === 'food') {
        const food = foods.find(f => f.id === data.itemId);
        if (food) {
          setConstitutes([...constitutes, { 
            ...newConstitute, 
            food, 
            food_quantity: data.quantity 
          }]);
        }
      } else {
        const dish = dishes.find(d => d.id === data.itemId);
        if (dish) {
          setConstitutes([...constitutes, { 
            ...newConstitute, 
            dish, 
            dish_quantity: data.quantity 
          }]);
        }
      }
      
      reset();
      setAddingItem(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'élément');
    }
  };

  const handleRemoveItem = async (constituteId: number) => {
    console.log('Tentative de suppression avec ID:', constituteId);
    
    // Debug détaillé si ID undefined
    if (constituteId === undefined) {
      console.error('ID undefined détecté ! Constitutes actuels:', constitutes);
      const problematicConstitute = constitutes.find(c => c.id === undefined);
      if (problematicConstitute) {
        console.error('Constitute problématique:', problematicConstitute);
        console.error('Clés disponibles:', Object.keys(problematicConstitute));
      }
      alert('Erreur: ID manquant pour la suppression');
      return;
    }
    
    if (!confirm('Supprimer cet élément du repas ?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/constitutes/${constituteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${jwt}` },
      });

      if (response.ok) {
        setConstitutes(constitutes.filter(c => c.id !== constituteId));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch {
      alert('Erreur réseau lors de la suppression');
    }
  };

  const handleDeleteMeal = async () => {
    if (!confirm('Supprimer définitivement ce repas et sa composition ?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/meals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${jwt}` },
      });

      if (response.ok) {
        navigate('/meals');
      } else {
        alert('Erreur lors de la suppression du repas');
      }
    } catch {
      alert('Erreur réseau lors de la suppression');
    }
  };

  // Calculer les apports nutritionnels totaux
  const calculateTotalNutrition = () => {
    return constitutes.reduce((total, constitute) => {
      if (constitute.food && constitute.food_quantity) {
        const factor = constitute.food_quantity / 100;
        return {
          calories: total.calories + (constitute.food.calories * factor),
          protein: total.protein + (constitute.food.protein * factor),
          carbs: total.carbs + (constitute.food.carbs * factor),
          fat: total.fat + (constitute.food.fat * factor),
        };
      }
      // Pour les plats, on pourrait calculer à partir de leur composition
      // Pour l'instant, on retourne les valeurs actuelles
      return total;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totalNutrition = calculateTotalNutrition();

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement de la composition..." />
        </div>
      </MainLayout>
    );
  }

  if (error || !meal) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p>{error || 'Repas non trouvé'}</p>
            <button
              onClick={() => navigate('/meals')}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Retour aux repas
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Composition : {meal.name}</h1>
              {meal.description && (
                <p className="text-gray-600 mb-2">{meal.description}</p>
              )}
              <p className="text-sm text-gray-500">Date : {new Date(meal.date).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/meals/${id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Modifier le repas
              </Link>
              <button
                onClick={handleDeleteMeal}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Supprimer le repas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Composition actuelle */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Composition actuelle</h2>
              
              {constitutes.length === 0 ? (
                <Card>
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun aliment ou plat dans ce repas</p>
                    <p className="text-sm mt-2">Ajoutez des éléments pour composer votre repas</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {constitutes.map((constitute, index) => (
                    <Card key={constitute.id || `constitute-${index}`}>
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
                          {constitute.food && constitute.food_quantity && (
                            <p className="text-xs text-gray-500">
                              {Math.round((constitute.food.calories * constitute.food_quantity) / 100)} kcal
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(constitute.id)}
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

            {/* Ajouter un élément + Résumé nutritionnel */}
            <div className="space-y-6">
              {/* Ajouter un élément */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un élément</h2>
                
                {!addingItem ? (
                  <Card>
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Ajoutez des aliments ou des plats</p>
                      <Button onClick={() => setAddingItem(true)}>
                        Ajouter un élément
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <form onSubmit={handleSubmit(onAddItem)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type d'élément
                        </label>
                        <select
                          {...register('itemType', { required: 'Sélectionnez un type' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Choisir...</option>
                          <option value="food">Aliment</option>
                          <option value="dish">Plat</option>
                        </select>
                        {errors.itemType && (
                          <p className="text-red-600 text-sm mt-1">{errors.itemType.message}</p>
                        )}
                      </div>

                      {itemType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {itemType === 'food' ? 'Aliment' : 'Plat'}
                          </label>
                          <select
                            {...register('itemId', { 
                              required: `Sélectionnez un ${itemType === 'food' ? 'aliment' : 'plat'}`,
                              valueAsNumber: true 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Choisir...</option>
                            {itemType === 'food' 
                              ? foods.map((food) => (
                                  <option key={food.id} value={food.id}>
                                    {food.name} ({food.calories} kcal/100g)
                                  </option>
                                ))
                              : dishes.map((dish) => (
                                  <option key={dish.id} value={dish.id}>
                                    {dish.name}
                                  </option>
                                ))
                            }
                          </select>
                          {errors.itemId && (
                            <p className="text-red-600 text-sm mt-1">{errors.itemId.message}</p>
                          )}
                        </div>
                      )}

                      <Input
                        label={itemType === 'food' ? 'Quantité (g)' : 'Nombre de portions'}
                        type="number"
                        min="0.1"
                        step="0.1"
                        placeholder={itemType === 'food' ? 'Ex: 150.5' : 'Ex: 1.5'}
                        {...register('quantity', { 
                          required: 'La quantité est requise',
                          min: { value: 0.1, message: itemType === 'food' ? 'Minimum 0.1g' : 'Minimum 0.1 portion' },
                          valueAsNumber: true
                        })}
                        error={errors.quantity?.message}
                      />

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setAddingItem(false);
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

              {/* Résumé nutritionnel */}
              {constitutes.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Résumé nutritionnel</h2>
                  <Card>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Calories:</span>
                        <span>{Math.round(totalNutrition.calories)} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Protéines:</span>
                        <span>{Math.round(totalNutrition.protein)} g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Glucides:</span>
                        <span>{Math.round(totalNutrition.carbs)} g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Lipides:</span>
                        <span>{Math.round(totalNutrition.fat)} g</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-between">
            <Link
              to="/meals"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              ← Retour aux repas
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComposeMealPage;
