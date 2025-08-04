import React from 'react';
import ProfileCard from '../molecules/ProfileCard';
import DashboardSectionCard from '../molecules/DashboardSectionCard';

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
            variant="success"
          />

          <DashboardSectionCard
            title="Mes repas"
            description="Enregistrez et organisez vos repas"
            buttonText="Gérer mes repas"
            to="/meals"
            variant="primary"
          />

          <DashboardSectionCard
            title="Mes plats"
            description="Créez des plats composés d'aliments"
            buttonText="Gérer mes plats"
            to="/dishes"
            variant="outline"
          />

          <DashboardSectionCard
            title="Suivi du poids"
            description="Suivez votre évolution corporelle"
            buttonText="Gérer mes pesées"
            to="/weights"
            variant="danger"
          />

          <DashboardSectionCard
            title="Mes propositions"
            description="Consultez vos propositions d'aliment en attente"
            buttonText="Gérer mes propositions"
            to="/foods/my-proposals"
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
