<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Meal;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @implements ProcessorInterface<Meal, Meal|null>
 */
class MealStateProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $user = $this->security->getUser();
        
        if (!$user || !$data instanceof Meal) {
            throw new \RuntimeException('Access denied');
        }
        if (!$user instanceof User) {
            throw new \RuntimeException('Access denied');
        }

        // Pour les créations (POST)
        if ($operation instanceof \ApiPlatform\Metadata\Post) {
            $data->setUser($user); // Associer le repas à l'utilisateur connecté
        }

        // Pour les modifications (PUT/PATCH)
        if ($operation instanceof \ApiPlatform\Metadata\Put || $operation instanceof \ApiPlatform\Metadata\Patch) {
            // Récupérer l'ID depuis les paramètres d'URL (uriVariables)
            $id = $uriVariables['id'] ?? null;
            
            if (!$id) {
                throw new \RuntimeException('Meal ID is missing from URL');
            }
            
            // Récupérer l'entité existante depuis la base de données
            $existingMeal = $this->entityManager->find(Meal::class, $id);
            
            if (!$existingMeal) {
                throw new \RuntimeException('Meal not found');
            }
            
            // Vérifier que le repas appartient à l'utilisateur connecté
            if ($existingMeal->getUser() !== $user) {
                throw new \RuntimeException('Access denied');
            }
            
            // Mettre à jour les champs de l'entité existante
            $existingMeal->setName($data->getName());
            if ($data->getDescription() !== null) {
                $existingMeal->setDescription($data->getDescription());
            }
            if ($data->getDate() !== null) {
                $existingMeal->setDate($data->getDate());
            }
            

            
            // Utiliser l'entité existante mise à jour
            $data = $existingMeal;
        }

        // Pour les suppressions (DELETE)
        if ($operation instanceof \ApiPlatform\Metadata\Delete) {
            if ($data->getUser() !== $user) {
                throw new \RuntimeException('Access denied');
            }
            
            // Supprimer manuellement le repas avec cascade Doctrine
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
