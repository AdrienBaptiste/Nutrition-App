import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import Card from '../components/atoms/Card';
import { useAuth } from '../hooks/useAuth';

interface Meal {
  id: number;
  name: string;
  description?: string;
  date: string;
}

const MealsPage: React.FC = () => {
  const { jwt } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      if (!jwt) {
        setError('Non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/meals', {
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
            setError(`Erreur ${response.status}: Impossible de charger les repas.`);
          }
          return;
        }

        const data = await response.json();
        
        // API Platform retourne les données dans data.member
        const meals = Array.isArray(data) ? data : (data.member || []);
        setMeals(meals);
      } catch {
        setError('Erreur réseau. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [jwt]);

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce repas ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/meals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });

      if (response.ok) {
        setMeals(meals.filter(meal => meal.id !== id));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch {
      alert('Erreur réseau lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement des repas..." />
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
            <h1 className="text-3xl font-bold text-gray-800">Mes Repas</h1>
            <Link
              to="/meals/new"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Nouveau Repas
            </Link>
          </div>

          {meals.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun repas</h3>
                <p className="text-gray-600 mb-4">Vous n'avez pas encore enregistré de repas.</p>
                <Link
                  to="/meals/new"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Enregistrer votre premier repas
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((meal) => (
                <Card key={meal.id}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{meal.name}</h3>
                    <div className="flex space-x-2">
                      <Link
                        to={`/meals/${meal.id}/edit`}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  
                  {meal.description && (
                    <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Date:</span>
                    <span className="ml-1">{formatDate(meal.date)}</span>
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

export default MealsPage;
