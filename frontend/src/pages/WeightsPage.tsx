import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import Card from '../components/atoms/Card';
import Title from '../components/atoms/Title';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from '../components/molecules/ConfirmModal';
import WeightChart from '../components/molecules/WeightChart';

interface Weight {
  id: number;
  value: number;
  date: string;
}

const WeightsPage: React.FC = () => {
  const { jwt } = useAuth();
  const [weights, setWeights] = useState<Weight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchWeights = async () => {
      if (!jwt) {
        setError('Non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/weights', {
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
            setError(`Erreur ${response.status}: Impossible de charger les pesées.`);
          }
          return;
        }

        const data = await response.json();
        
        // API Platform retourne les données dans data.member
        const weights = Array.isArray(data) ? data : (data.member || []);
        setWeights(weights);
      } catch {
        setError('Erreur réseau. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeights();
  }, [jwt]);

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      const response = await fetch(`http://localhost:8000/api/v1/weights/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
        },
      });
      if (response.ok) {
        setWeights(weights.filter(weight => weight.id !== pendingDeleteId));
        setPendingDeleteId(null);
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch {
      alert('Erreur réseau lors de la suppression');
    } finally {
    }
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateEvolution = (currentIndex: number) => {
    if (currentIndex === weights.length - 1) return null;
    
    const current = weights[currentIndex];
    const previous = weights[currentIndex + 1];
    const diff = current.value - previous.value;
    
    return {
      value: Math.abs(diff),
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable'
    };
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement des pesées..." />
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
      <ConfirmModal
        open={pendingDeleteId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <div className="mb-2 font-semibold text-lg text-gray-800">Confirmer la suppression</div>
        <div className="text-gray-700">
          Êtes-vous sûr de vouloir supprimer cette pesée ?<br />
          Cette action est <span className="text-red-600 font-bold">irréversible</span>.
        </div>
      </ConfirmModal>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Suivi du Poids</h1>
            <Link
              to="/weights/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Nouvelle Pesée
            </Link>
          </div>

          {/* Affichage du graphique d'évolution du poids */}
          <WeightChart data={weights.map(({ date, value }) => ({ date, value }))} />

          {weights.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Title level={3} className="mb-2 text-gray-800">Aucune pesée</Title>
                <p className="text-gray-600 mb-4">Commencez à suivre votre poids en enregistrant votre première pesée.</p>
                <Link
                  to="/weights/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer votre première pesée
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weights.map((weight, index) => {
                const evolution = calculateEvolution(index);
                return (
                  <Card key={weight.id}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-800">
                          {weight.value} kg
                        </span>
                        {evolution && (
                          <span className={`text-sm font-medium ${
                            evolution.trend === 'up' ? 'text-red-600' : 
                            evolution.trend === 'down' ? 'text-green-600' : 
                            'text-gray-600'
                          }`}>
                            {evolution.trend === 'up' ? '↗' : evolution.trend === 'down' ? '↘' : '→'}
                            {evolution.value.toFixed(1)}kg
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/weights/${weight.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(weight.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Date:</span>
                      <span className="ml-1">{formatDate(weight.date)}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default WeightsPage;
