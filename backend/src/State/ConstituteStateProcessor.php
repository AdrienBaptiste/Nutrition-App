<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Constitute;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class ConstituteStateProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $user = $this->security->getUser();
        
        if (!$user || !$data instanceof Constitute) {
            throw new \RuntimeException('Access denied');
        }

        // Validation métier : soit food+food_quantity, soit dish+dish_quantity, mais pas les deux
        // Si aucun des deux n'est fourni, c'est OK (repas rapide sans détail)
        $hasFood = $data->getFood() !== null && $data->getFoodQuantity() !== null;
        $hasDish = $data->getDish() !== null && $data->getDishQuantity() !== null;
        
        // Interdire d'avoir les deux en même temps
        if ($hasFood && $hasDish) {
            throw new \RuntimeException('Cannot have both food and dish in the same constitute entry');
        }
        
        // Si on a un food, on doit avoir food_quantity (et vice versa)
        if (($data->getFood() !== null && $data->getFoodQuantity() === null) || 
            ($data->getFood() === null && $data->getFoodQuantity() !== null)) {
            throw new \RuntimeException('Food and food_quantity must be provided together');
        }
        
        // Si on a un dish, on doit avoir dish_quantity (et vice versa)
        if (($data->getDish() !== null && $data->getDishQuantity() === null) || 
            ($data->getDish() === null && $data->getDishQuantity() !== null)) {
            throw new \RuntimeException('Dish and dish_quantity must be provided together');
        }

        // Pour les créations (POST)
        if ($operation instanceof \ApiPlatform\Metadata\Post) {
            // Vérifier que le repas appartient à l'utilisateur connecté
            if ($data->getMeal()->getUser() !== $user) {
                throw new \RuntimeException('Access denied: Meal does not belong to you');
            }
            
            // Vérifier que l'aliment ou le plat appartient à l'utilisateur connecté
            if ($hasFood && $data->getFood()->getUser() !== $user) {
                throw new \RuntimeException('Access denied: Food does not belong to you');
            }
            
            if ($hasDish && $data->getDish()->getUser() !== $user) {
                throw new \RuntimeException('Access denied: Dish does not belong to you');
            }
        }

        // Pour les modifications (PUT/PATCH)
        if ($operation instanceof \ApiPlatform\Metadata\Put || $operation instanceof \ApiPlatform\Metadata\Patch) {
            // Vérifier que le repas appartient à l'utilisateur connecté
            if ($data->getMeal()->getUser() !== $user) {
                throw new \RuntimeException('Access denied');
            }
        }

        // Pour les suppressions (DELETE)
        if ($operation instanceof \ApiPlatform\Metadata\Delete) {
            if ($data->getMeal()->getUser() !== $user) {
                throw new \RuntimeException('Access denied');
            }
            $this->entityManager->remove($data);
            $this->entityManager->flush();
            return null;
        }

        // Sauvegarder les modifications
        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}
