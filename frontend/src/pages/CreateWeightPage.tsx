import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import ErrorMessage from '../components/atoms/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

interface WeightFormInputs {
  value: number;
  date: string;
}

const CreateWeightPage: React.FC = () => {
  const { jwt } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WeightFormInputs>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10) // Format YYYY-MM-DD
    }
  });
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const onSubmit = async (data: WeightFormInputs) => {
    setServerError(undefined);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/weights', {
        method: 'POST',
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

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Nouvelle Pesée</h1>
            <p className="text-gray-600">Enregistrez votre poids pour suivre votre évolution.</p>
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

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Conseil
                    </h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>Pour un suivi précis, pesez-vous toujours dans les mêmes conditions : le matin, à jeun, après être allé aux toilettes.</p>
                    </div>
                  </div>
                </div>
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
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer la pesée'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateWeightPage;
