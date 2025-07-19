import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import Card from '../components/atoms/Card';
import { useAuth } from '../hooks/useAuth';

interface Dish {
  id: number;
  name: string;
  description?: string;
  contains?: Array<{
    food: {
      id: number;
      name: string;
    };
    quantity: number;
  }>;
}

const DishesPage: React.FC = () => {
  const { jwt } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      if (!jwt) {
        setError('Non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/dishes', {
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
            setError(`Erreur ${response.status}: Impossible de charger les plats.`);
          }
          return;
        }

        const data = await response.json();
        
        // API Platform retourne les données dans data.member
        const dishes = Array.isArray(data) ? data : (data.member || []);
        setDishes(dishes);
      } catch {
        setError('Erreur réseau. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [jwt]);

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/dishes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      if (response.ok) {
        setDishes(dishes.filter(dish => dish.id !== id));
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
          <LoadingSpinner message="Chargement des plats..." />
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
            <h1 className="text-3xl font-bold text-gray-800">Mes Plats</h1>
            <Link
              to="/dishes/new"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Nouveau Plat
            </Link>
          </div>

          {dishes.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun plat</h3>
                <p className="text-gray-600 mb-4">Vous n'avez pas encore créé de plats.</p>
                <Link
                  to="/dishes/new"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Créer votre premier plat
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map((dish) => (
                <Card key={dish.id}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{dish.name}</h3>
                    <div className="flex space-x-2">
                      <Link
                        to={`/dishes/${dish.id}/edit`}
                        className="text-purple-600 hover:text-purple-800 text-sm"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(dish.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  
                  {dish.description && (
                    <p className="text-gray-600 text-sm mb-3">{dish.description}</p>
                  )}
                  
                  {dish.contains && dish.contains.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Composition :</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {dish.contains.slice(0, 3).map((contain, index) => (
                          <li key={index}>
                            • {contain.quantity}g de {contain.food.name}
                          </li>
                        ))}
                        {dish.contains.length > 3 && (
                          <li className="text-gray-500">... et {dish.contains.length - 3} autres</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t">
                    <Link
                      to={`/dishes/${dish.id}/compose`}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Gérer la composition →
                    </Link>
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

export default DishesPage;
