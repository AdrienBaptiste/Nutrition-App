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
  const handleSectionClick = (section: string) => {
    console.log(`Navigation vers ${section}`);
    // TODO: Implémenter la navigation vers les différentes sections
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Profil utilisateur */}
        <ProfileCard profile={profile} />

        {/* Sections principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardSectionCard
            title="Aliments"
            description="Gérez vos aliments favoris"
            buttonText="Voir les aliments"
            buttonColor="blue"
            onButtonClick={() => handleSectionClick('aliments')}
          />
          
          <DashboardSectionCard
            title="Repas"
            description="Enregistrez vos repas"
            buttonText="Voir les repas"
            buttonColor="green"
            onButtonClick={() => handleSectionClick('repas')}
          />
          
          <DashboardSectionCard
            title="Poids"
            description="Suivez votre évolution"
            buttonText="Voir le suivi"
            buttonColor="purple"
            onButtonClick={() => handleSectionClick('poids')}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
