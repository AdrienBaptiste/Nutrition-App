import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Title from '../components/atoms/Title';
import Button from '../components/atoms/Button';
import ConfirmModal from '../components/molecules/ConfirmModal';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

interface FoodProposal {
  id: number;
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  status: 'pending' | 'active';
  user: {
    id: number;
    name: string;
  };
}

// (Suppression de la définition locale du composant)

/*
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
*/

const MyFoodProposalsPage: React.FC = () => {
  const { jwt, user } = useAuth();
  const [proposals, setProposals] = useState<FoodProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!jwt) {
        setError('Non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/foods?includeMyProposals=true', {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des propositions');
        }

        const data = await response.json();
        const foodList = Array.isArray(data) ? data : data.member || [];

        // Le backend filtre déjà par utilisateur et status pending
        // On s'assure juste que ce sont bien des propositions pending
        const userProposals = foodList.filter((food: FoodProposal) => food.status === 'pending');

        setProposals(userProposals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [jwt, user?.id]);

  const handleDelete = async (id: number) => {
    if (!jwt) {
      alert('Vous devez être connecté pour supprimer une proposition.');
      return;
    }
    setDeletingId(id);
    setPendingDeleteId(null);

    try {
      console.log(`[FRONTEND] Tentative de suppression de l'aliment ID: ${id}`);
      const response = await fetch(`http://localhost:8000/api/v1/foods/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwt}` },
      });

      console.log(`[FRONTEND] Réponse DELETE: ${response.status} ${response.statusText}`);

      if (response.ok) {
        console.log(`[FRONTEND] Suppression réussie pour l'aliment ID: ${id}`);
        setProposals(proposals.filter((p) => p.id !== id));
        alert('Proposition supprimée avec succès !');
      } else {
        const errorText = await response.text();
        console.error(`[FRONTEND] Erreur ${response.status}: ${errorText}`);

        if (response.status === 403 || response.status === 401) {
          alert('Accès refusé : vous ne pouvez supprimer que vos propres propositions en attente.');
        } else if (response.status === 404) {
          alert('Proposition non trouvée.');
        } else {
          alert(`Erreur lors de la suppression (${response.status}): ${errorText}`);
        }
      }
    } catch (error) {
      console.error('[FRONTEND] Exception lors de la suppression:', error);
      alert('Erreur de connexion lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Chargement de vos propositions..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Modal de confirmation */}
      <ConfirmModal
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => pendingDeleteId && handleDelete(pendingDeleteId)}
      >
        <div className="mb-2 font-semibold text-lg text-gray-800">Confirmer la suppression</div>
        <div className="text-gray-700">
          Êtes-vous sûr de vouloir supprimer cette proposition ?<br />
          Cette action est <span className="text-red-600 font-bold">irréversible</span>.
        </div>
      </ConfirmModal>
      <div className="container mx-auto py-8 px-2 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mes propositions d'aliments</h1>
          <Link to="/foods/propose">
            <Button>Proposer un nouvel aliment</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {proposals.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <Title level={2} className="text-gray-600 mb-2">
                Aucune proposition en cours
              </Title>
              <p className="text-gray-500 mb-6">
                Vous n'avez pas encore proposé d'aliment ou toutes vos propositions ont été
                traitées.
              </p>
              <Link to="/foods/propose">
                <Button>Proposer votre premier aliment</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Title level={2} className="font-semibold text-yellow-800 mb-2">
                ⏳ Propositions en attente
              </Title>
              <p className="text-sm text-yellow-700">
                Vos propositions sont en cours d'examen par un administrateur. Une fois validées,
                elles seront disponibles pour tous les utilisateurs.
              </p>
            </div>

            <div className="grid gap-6">
              {proposals.map((proposal) => (
                <Card key={proposal.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Title level={3} className="text-lg font-semibold text-gray-800">
                          {proposal.name}
                        </Title>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
                          En attente
                        </span>
                      </div>

                      {proposal.description && (
                        <p className="text-gray-600 mb-3">{proposal.description}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="font-medium text-gray-700">Calories</div>
                          <div className="text-gray-900">{proposal.calories} kcal</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="font-medium text-gray-700">Protéines</div>
                          <div className="text-gray-900">{proposal.protein}g</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="font-medium text-gray-700">Glucides</div>
                          <div className="text-gray-900">{proposal.carbs}g</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="font-medium text-gray-700">Lipides</div>
                          <div className="text-gray-900">{proposal.fat}g</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Link to={`/foods/${proposal.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setPendingDeleteId(proposal.id)}
                        disabled={deletingId === proposal.id}
                      >
                        {deletingId === proposal.id ? 'Suppression...' : 'Supprimer'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/foods">
                <Button variant="outline">Voir la base d'aliments commune</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default MyFoodProposalsPage;
