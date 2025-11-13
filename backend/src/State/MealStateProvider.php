<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Meal;
use App\Entity\User;
use App\Repository\MealRepository;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProviderInterface<Meal>
 */
class MealStateProvider implements ProviderInterface
{
    public function __construct(
        private MealRepository $mealRepository,
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return null;
        }

        // Si c'est une collection (GET /api/v1/meals)
        if ($operation instanceof \ApiPlatform\Metadata\GetCollection) {
            return $this->mealRepository->findBy(['user' => $user instanceof User ? $user : null], ['date' => 'DESC']);
        }

        // Si c'est un élément spécifique (GET /api/v1/meals/{id})
        if (isset($uriVariables['id'])) {
            $meal = $this->mealRepository->find($uriVariables['id']);
            
            // Vérifier que le repas appartient à l'utilisateur connecté
            if ($meal && $user instanceof User && $meal->getUser() === $user) {
                return $meal;
            }
            
            return null; // Accès refusé
        }

        return null;
    }
}
