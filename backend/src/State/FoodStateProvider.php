<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Food;
use App\Repository\FoodRepository;
use Symfony\Bundle\SecurityBundle\Security;

class FoodStateProvider implements ProviderInterface
{
    public function __construct(
        private FoodRepository $foodRepository,
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return null;
        }

        // Si c'est une collection (GET /api/v1/foods)
        if ($operation instanceof \ApiPlatform\Metadata\GetCollection) {
            return $this->foodRepository->findBy(['user' => $user]);
        }

        // Si c'est un élément spécifique (GET /api/v1/foods/{id})
        if (isset($uriVariables['id'])) {
            $food = $this->foodRepository->find($uriVariables['id']);
            
            // Vérifier que l'aliment appartient à l'utilisateur connecté
            if ($food && $food->getUser() === $user) {
                return $food;
            }
            
            return null; // Accès refusé
        }

        return null;
    }
}
