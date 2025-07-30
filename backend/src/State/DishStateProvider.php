<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Dish;
use App\Repository\DishRepository;
use Symfony\Bundle\SecurityBundle\Security;

class DishStateProvider implements ProviderInterface
{
    public function __construct(
        private DishRepository $dishRepository,
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        
        if (!$user) {
            return null;
        }

        // Si c'est une collection (GET /api/v1/dishes)
        if ($operation instanceof \ApiPlatform\Metadata\GetCollection) {
            return $this->dishRepository->findBy(['user' => $user], ['name' => 'ASC']);
        }

        // Si c'est un élément spécifique (GET /api/v1/dishes/{id})
        if (isset($uriVariables['id'])) {
            $dish = $this->dishRepository->find($uriVariables['id']);
            
            // Vérifier que le plat appartient à l'utilisateur connecté
            if ($dish && $dish->getUser() === $user) {
                return $dish;
            }
            
            return null; // Accès refusé
        }

        return null;
    }
}
