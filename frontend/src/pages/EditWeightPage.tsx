import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import ErrorMessage from '../components/atoms/ErrorMessage';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

interface WeightFormInputs {
  value: number;
  date: string;
}

const EditWeightPage: React.FC = () => {
  const { jwt } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WeightFormInputs>();
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchWeight = async () => {
      if (!id || !jwt) {
        setFetchError('ID de la pesée manquant ou utilisateur non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/weights/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setFetchError('Pesée non trouvée');
          } else if (response.status === 401) {
            setFetchError('Session expirée. Veuillez vous reconnecter.');
          } else {
            setFetchError(`Erreur ${response.status}: Impossible de charger la pesée.`);
          }
          return;
        }

        const weight = await response.json();
        
        // Pré-remplir le formulaire
        setValue('value', weight.value);
        setValue('date', new Date(weight.date).toISOString().slice(0, 10));
      } catch {
        setFetchError('Erreur réseau. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeight();
  }, [id, jwt, setValue]);

  const onSubmit = async (data: WeightFormInputs) => {
    setServerError(undefined);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/weights/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: parseFloat(data.value.toString()),
          date: new Date(data.date).toISOString(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setServerError('Session expirée. Veuillez vous reconnecter.');
        } else if (response.status === 400) {
          const result = await response.json();
          setServerError(result.error?.[0] || result.error || 'Données invalides. Vérifiez vos informations.');
        } else if (response.status === 404) {
          setServerError('Pesée non trouvée');
        } else {
          setServerError(`Erreur serveur (${response.status}). Veuillez réessayer plus tard.`);
        }
        return;
      }

      // Succès : redirection vers la liste des pesées
      navigate('/weights');
    } catch {
      setServerError('Erreur réseau. Vérifiez votre connexion et réessayez.');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement de la pesée..." />
        </div>
      </MainLayout>
    );
  }

  if (fetchError) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p>{fetchError}</p>
            <button
              onClick={() => navigate('/weights')}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Retour aux pesées
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Modifier la Pesée</h1>
            <p className="text-gray-600">Modifiez les informations de votre pesée.</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Poids (kg)"
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  placeholder="Ex: 70.5"
                  {...register('value', { 
                    required: 'Le poids est requis',
                    min: { value: 20, message: 'Le poids doit être d\'au moins 20 kg' },
                    max: { value: 300, message: 'Le poids ne peut pas dépasser 300 kg' },
                    valueAsNumber: true
                  })}
                  error={errors.value?.message}
                />

                <Input
                  label="Date de la pesée"
                  type="date"
                  {...register('date', { 
                    required: 'La date est requise'
                  })}
                  error={errors.date?.message}
                />
              </div>

              <ErrorMessage message={serverError} />

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/weights')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Modification...' : 'Modifier la pesée'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditWeightPage;
