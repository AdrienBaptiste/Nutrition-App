import React, { useEffect, useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import Title from '../components/atoms/Title';
import DashboardContent from '../components/organisms/DashboardContent';
import { useAuth } from '../hooks/useAuth';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

const DashboardPage: React.FC = () => {
  const { jwt } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!jwt) {
        setError('Non authentifié');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expirée. Veuillez vous reconnecter.');
          } else {
            setError(`Erreur ${response.status}: Impossible de charger le profil.`);
          }
          return;
        }

        const data = await response.json();
        setProfile(data);
      } catch {
        setError('Erreur réseau. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [jwt]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <LoadingSpinner message="Chargement du profil..." />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-red-600 text-center">
            <Title level={2} className="mb-2">Erreur</Title>
            <p>{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {profile && <DashboardContent profile={profile} />}
    </MainLayout>
  );
};

export default DashboardPage;
