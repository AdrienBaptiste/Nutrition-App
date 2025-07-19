<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Dish;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class DishStateProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $user = $this->security->getUser();
        
        if (!$user || !$data instanceof Dish) {
            throw new \RuntimeException('Access denied');
        }

        // Pour les créations (POST)
        if ($operation instanceof \ApiPlatform\Metadata\Post) {
            $data->setUser($user); // Associer le plat à l'utilisateur connecté
        }

        // Pour les modifications (PUT/PATCH)
        if ($operation instanceof \ApiPlatform\Metadata\Put || $operation instanceof \ApiPlatform\Metadata\Patch) {
            // Récupérer le plat existant depuis la base de données
            if (isset($uriVariables['id'])) {
                $existingDish = $this->entityManager->getRepository(Dish::class)->find($uriVariables['id']);
                if (!$existingDish || $existingDish->getUser() !== $user) {
                    throw new \RuntimeException('Access denied');
                }
                
                // Mettre à jour les champs de l'entité existante au lieu de créer une nouvelle
                $existingDish->setName($data->getName());
                $existingDish->setDescription($data->getDescription());
                
                // Utiliser l'entité existante pour la suite du traitement
                $data = $existingDish;
            }
        }

        // Pour les suppressions (DELETE)
        if ($operation instanceof \ApiPlatform\Metadata\Delete) {
            if ($data->getUser() !== $user) {
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
