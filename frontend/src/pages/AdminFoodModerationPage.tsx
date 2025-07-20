import React, { useEffect, useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import Title from '../components/atoms/Title';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from '../components/molecules/ConfirmModal';

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

const AdminFoodModerationPage: React.FC = () => {
  const { jwt, user } = useAuth();

  // Debug: afficher les infos utilisateur
  console.log('=== INFO UTILISATEUR ADMIN PAGE ===');
  console.log('User:', user);
  console.log('User email:', user?.email);
  console.log('JWT présent:', !!jwt);
  const [proposals, setProposals] = useState<FoodProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: 'approve' | 'reject';
    id: number;
  } | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!jwt) {
        setError('Non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/foods', {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des propositions');
        }

        const data = await response.json();
        const foodList = Array.isArray(data) ? data : data.member || [];

        // Filtrer pour ne garder que les propositions pending
        const pendingProposals = foodList.filter((food: FoodProposal) => food.status === 'pending');

        setProposals(pendingProposals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [jwt]);

  const handleApprove = (id: number) => {
    if (!jwt) {
      alert("Erreur: Pas de token d'authentification");
      return;
    }
    setPendingAction({ type: 'approve', id });
  };

  const doApprove = async (id: number) => {
    setActionLoading(id);
    try {
      // D'abord récupérer les données complètes de l'aliment
      const getUrl = `http://localhost:8000/api/v1/foods/${id}`;
      const getResponse = await fetch(getUrl, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!getResponse.ok) {
        throw new Error(`Impossible de récupérer l'aliment: ${getResponse.status}`);
      }
      const foodData = await getResponse.json();
      // Maintenant utiliser PUT avec toutes les données + status modifié
      const putUrl = `http://localhost:8000/api/v1/foods/${id}`;
      const response = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...foodData,
          status: 'active',
        }),
      });
      if (response.ok) {
        setProposals(proposals.filter((p) => p.id !== id));
        // Afficher un message de succès UX-friendly ici
      } else {
        const errorData = await response.text();
        console.error('Erreur validation:', response.status, errorData);
        // Afficher un message d'erreur UX-friendly ici
      }
    } catch (error) {
      console.error('Erreur validation:', error);
      alert(
        `Erreur lors de la validation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (id: number) => {
    if (!jwt) {
      alert("Erreur: Pas de token d'authentification");
      return;
    }
    setPendingAction({ type: 'reject', id });
  };

  const doReject = async (id: number) => {
    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/foods/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (response.ok) {
        setProposals(proposals.filter((p) => p.id !== id));
        // Afficher un message de succès UX-friendly ici
      } else {
        const errorData = await response.text();
        console.error('Erreur suppression:', response.status, errorData);
        // Afficher un message d'erreur UX-friendly ici
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setActionLoading(null);
      setPendingAction(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Chargement des propositions..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-2 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <Title level={1} className="text-gray-800">
            Modération des aliments
            {proposals.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                {proposals.length} en attente
              </span>
            )}
          </Title>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {proposals.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Aucune proposition en attente
              </h2>
              <p className="text-gray-500">Toutes les propositions d'aliments ont été traitées.</p>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="font-semibold text-blue-800 mb-2">🛡️ Instructions de modération</h2>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • <strong>Valider</strong> : L'aliment sera ajouté à la base commune et utilisable
                  par tous
                </li>
                <li>
                  • <strong>Refuser</strong> : L'aliment sera supprimé définitivement
                </li>
                <li>• Vérifiez la cohérence des valeurs nutritionnelles</li>
                <li>• Évitez les doublons avec des aliments existants</li>
              </ul>
            </div>

            <div className="grid gap-6">
              {proposals.map((proposal) => (
                <Card key={proposal.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{proposal.name}</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
                          En attente
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        Proposé par : <strong>{proposal.user.name}</strong>
                      </div>

                      {proposal.description && (
                        <p className="text-gray-600 mb-3">{proposal.description}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-700">Calories</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {proposal.calories} <span className="text-sm font-normal">kcal</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-700">Protéines</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {proposal.protein} <span className="text-sm font-normal">g</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-700">Glucides</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {proposal.carbs} <span className="text-sm font-normal">g</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="font-medium text-gray-700">Lipides</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {proposal.fat} <span className="text-sm font-normal">g</span>
                          </div>
                        </div>
                      </div>

                      {/* Vérification automatique des valeurs */}
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Vérification automatique :
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {(() => {
                            // Calcul théorique des calories
                            const theoreticalCalories =
                              proposal.protein * 4 + proposal.carbs * 4 + proposal.fat * 9;
                            const calorieDifference = Math.abs(
                              proposal.calories - theoreticalCalories
                            );
                            const macroTotal = proposal.protein + proposal.carbs + proposal.fat;

                            const warnings = [];

                            // Vérification cohérence calories (seuil plus réaliste)
                            if (calorieDifference > 100) {
                              warnings.push(
                                <span
                                  key="calories"
                                  className="px-2 py-1 bg-red-100 text-red-700 rounded"
                                  title={`Théorique: ${theoreticalCalories.toFixed(0)} kcal, Écart: ${calorieDifference.toFixed(0)} kcal`}
                                >
                                  ⚠️ Calories incohérentes
                                </span>
                              );
                            } else if (calorieDifference > 50) {
                              warnings.push(
                                <span
                                  key="calories-warning"
                                  className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded"
                                  title={`Théorique: ${theoreticalCalories.toFixed(0)} kcal, Écart: ${calorieDifference.toFixed(0)} kcal`}
                                >
                                  ⚠️ Écart calories modéré
                                </span>
                              );
                            }

                            // Vérification valeurs réalistes (seuil plus flexible)
                            if (macroTotal > 110) {
                              warnings.push(
                                <span
                                  key="macros"
                                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded"
                                  title={`Total: ${macroTotal.toFixed(1)}g`}
                                >
                                  ⚠️ Total macros élevé
                                </span>
                              );
                            }

                            if (proposal.calories > 1000) {
                              warnings.push(
                                <span
                                  key="high-calories"
                                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded"
                                >
                                  ⚠️ Calories très élevées
                                </span>
                              );
                            }

                            // Valeurs suspectes individuelles
                            if (proposal.protein > 50) {
                              warnings.push(
                                <span
                                  key="protein"
                                  className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded"
                                >
                                  ⚠️ Protéines élevées
                                </span>
                              );
                            }

                            if (proposal.fat > 50) {
                              warnings.push(
                                <span
                                  key="fat"
                                  className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded"
                                >
                                  ⚠️ Lipides élevés
                                </span>
                              );
                            }

                            // Si tout va bien
                            if (warnings.length === 0) {
                              warnings.push(
                                <span
                                  key="ok"
                                  className="px-2 py-1 bg-green-100 text-green-700 rounded"
                                >
                                  ✓ Valeurs cohérentes
                                </span>
                              );
                            }

                            return warnings;
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      <Button
                        variant="success"
                        onClick={() => handleApprove(proposal.id)}
                        disabled={actionLoading === proposal.id}
                      >
                        {actionLoading === proposal.id ? '...' : '✓ Valider'}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleReject(proposal.id)}
                        disabled={actionLoading === proposal.id}
                      >
                        {actionLoading === proposal.id ? '...' : '✗ Refuser'}
                      </Button>

                      {/* ConfirmModal pour validation/suppression */}
                      <ConfirmModal
                        open={!!pendingAction && pendingAction.id === proposal.id}
                        onConfirm={() => {
                          if (!pendingAction) return;
                          if (pendingAction.type === 'approve') doApprove(pendingAction.id);
                          if (pendingAction.type === 'reject') doReject(pendingAction.id);
                        }}
                        onCancel={() => setPendingAction(null)}
                        confirmLabel={pendingAction?.type === 'approve' ? 'Valider' : 'Supprimer'}
                        cancelLabel="Annuler"
                      >
                        <div className="mb-2 font-semibold text-lg text-gray-800">
                          {pendingAction?.type === 'approve'
                            ? 'Confirmer la validation'
                            : 'Confirmer la suppression'}
                        </div>
                        <div className="text-gray-700">
                          {pendingAction?.type === 'approve'
                            ? 'Voulez-vous vraiment valider cette proposition ? Elle sera rendue disponible pour tous les utilisateurs.'
                            : 'Êtes-vous sûr de vouloir supprimer définitivement cette proposition ? Cette action est irréversible.'}
                        </div>
                      </ConfirmModal>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminFoodModerationPage;
