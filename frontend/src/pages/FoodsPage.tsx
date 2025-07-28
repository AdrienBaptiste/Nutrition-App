import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import Card from '../components/atoms/Card';
import Title from '../components/atoms/Title';
import ConfirmModal from '../components/molecules/ConfirmModal';
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
  const { jwt, user } = useAuth();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const navigate = useNavigate();

  // Admin detection (same as elsewhere in project)
  const isAdmin = user && (
    user.email === 'admin@nutrition.app' ||
    (user.email && user.email.includes('admin')) ||
    (user.name && user.name.toLowerCase().includes('admin')) ||
    (user.roles && user.roles.includes('ROLE_ADMIN'))
  );


  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/foods`, {
          method: 'GET',
          headers: jwt ? {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          } : {
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
    // setError, setFoods, setLoading are stable from useState
  }, [jwt]);

  // Les aliments sont maintenant communs, pas de suppression individuelle
  // La modération se fait via la page admin

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
            <h1 className="text-3xl font-bold text-gray-800">Base d'Aliments</h1>
            {jwt && (
              <Link
                to="/foods/propose"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Proposer un Aliment
              </Link>
            )}
          </div>

          {foods.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun aliment disponible</h3>
                <p className="text-gray-600 mb-4">La base d'aliments est vide ou en cours de chargement.</p>
                <Link
                  to="/foods/propose"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Proposer un aliment
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <Card key={food.id}>
                  {/* Admin actions */}
                  {isAdmin && (
                    <div className="flex justify-end gap-2 mb-2">
                      <button
                        className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        onClick={() => navigate(`/foods/${food.id}/edit`)}
                        title="Modifier"
                      >
                        Modifier
                      </button>
                      <button
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 transition"
                        onClick={() => setPendingDeleteId(food.id)}
                        title="Supprimer"
                        disabled={actionLoading === food.id}
                      >
                        {actionLoading === food.id ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </div>
                  )}
                  <div className="mb-3">
                    <Title level={3} className="text-gray-800">{food.name}</Title>
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
    {/* ConfirmModal for delete */}
    {isAdmin && (
      <>
        {pendingDeleteId !== null && (
          <ConfirmModal
            open={true}
            onCancel={() => setPendingDeleteId(null)}
            onConfirm={async () => {
              setActionLoading(pendingDeleteId);
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/foods/${pendingDeleteId}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${jwt}` },
                });
                if (response.ok) {
                  setFoods((prev) => prev.filter(f => f.id !== pendingDeleteId));
                  setPendingDeleteId(null);
                } else {
                  alert('Erreur lors de la suppression.');
                }
              } catch {
                alert('Erreur réseau lors de la suppression.');
              } finally {
                setActionLoading(null);
              }
            }}
            confirmLabel="Oui, supprimer"
            cancelLabel="Annuler"
          >
            Voulez-vous vraiment supprimer cet aliment ? Cette action est irréversible.
          </ConfirmModal>
        )}
      </>
    )}
  </MainLayout>
);
};

export default FoodsPage;
