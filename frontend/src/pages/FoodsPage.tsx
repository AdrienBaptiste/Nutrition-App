import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import Card from '../components/atoms/Card';
import { useAuth } from '../hooks/useAuth';

interface Food {
  id: number;
  name: string;
  description?: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

const FoodsPage: React.FC = () => {
  const { jwt } = useAuth();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      if (!jwt) {
        setError('Non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/foods', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expirée. Veuillez vous reconnecter.');
          } else {
            setError(`Erreur ${response.status}: Impossible de charger les aliments.`);
          }
          return;
        }

        const data = await response.json();
        
        // API Platform retourne les données dans data.member
        const foods = Array.isArray(data) ? data : (data.member || []);
        setFoods(foods);
      } catch {
        setError('Erreur réseau. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [jwt]);

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet aliment ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/foods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      if (response.ok) {
        setFoods(foods.filter(food => food.id !== id));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch {
      alert('Erreur réseau lors de la suppression');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement des aliments..." />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p>{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Mes Aliments</h1>
            <Link
              to="/foods/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Nouvel Aliment
            </Link>
          </div>

          {foods.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun aliment</h3>
                <p className="text-gray-600 mb-4">Vous n'avez pas encore ajouté d'aliments.</p>
                <Link
                  to="/foods/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Ajouter votre premier aliment
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <Card key={food.id}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
                    <div className="flex space-x-2">
                      <Link
                        to={`/foods/${food.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  
                  {food.description && (
                    <p className="text-gray-600 text-sm mb-3">{food.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Calories:</span>
                      <span className="ml-1">{food.calories}kcal</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Protéines:</span>
                      <span className="ml-1">{food.protein}g</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Glucides:</span>
                      <span className="ml-1">{food.carbs}g</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Lipides:</span>
                      <span className="ml-1">{food.fat}g</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FoodsPage;
