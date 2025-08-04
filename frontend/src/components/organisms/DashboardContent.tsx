import React from 'react';
import ProfileCard from '../molecules/ProfileCard';
import DashboardSectionCard from '../molecules/DashboardSectionCard';
import { useAuth } from '../../hooks/useAuth';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

interface DashboardContentProps {
  profile: UserProfile;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ profile }) => {
  const { user } = useAuth();

  // Vérification du rôle admin
  const isAdmin =
    user?.email === 'admin@nutrition.app' ||
    user?.email?.includes('admin') ||
    user?.name?.toLowerCase().includes('admin') ||
    user?.roles?.includes('ROLE_ADMIN');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Profil utilisateur */}
        <ProfileCard profile={profile} />

        {/* Sections principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardSectionCard
            title="Les aliments"
            description="Consultez le référentiel d'aliments"
            buttonText="Voir les aliments"
            to="/foods"
            variant="secondary"
          />

          <DashboardSectionCard
            title="Mes repas"
            description="Enregistrez et organisez vos repas"
            buttonText="Gérer mes repas"
            to="/meals"
            variant="secondary"
          />

          <DashboardSectionCard
            title="Mes plats"
            description="Créez des plats composés d'aliments"
            buttonText="Gérer mes plats"
            to="/dishes"
            variant="secondary"
          />

          <DashboardSectionCard
            title="Suivi du poids"
            description="Suivez votre évolution corporelle"
            buttonText="Gérer mes pesées"
            to="/weights"
            variant="secondary"
          />
          {/* Masquer "Mes propositions" pour les admins car leurs aliments sont auto-validés */}

          {!isAdmin && (
            <DashboardSectionCard
              title="Mes propositions"
              description="Consultez vos propositions d'aliment en attente"
              buttonText="Gérer mes propositions"
              to="/foods/my-proposals"
              variant="secondary"
            />
          )}

          {/* Lien Admin - visible uniquement pour les admins */}
          {isAdmin && (
            <DashboardSectionCard
              title="Administration"
              description="Gestion des aliments"
              buttonText="Gérer mes propositions"
              to="/admin/food-moderation"
              variant="secondary"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
