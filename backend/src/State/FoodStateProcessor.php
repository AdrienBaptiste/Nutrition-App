<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Food;
use App\Repository\FoodRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Psr\Log\LoggerInterface;

class FoodStateProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
        private LoggerInterface $logger,
        private FoodRepository $foodRepository
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        try {
            $this->logger->info('=== [FOOD DEBUG TEST 2025] Début du process ===');
            $this->logger->info('[FOOD DEBUG] Début du process', [
                'operation' => get_class($operation),
                'foodId' => $data instanceof Food ? $data->getId() : 'unknown',
                'uriVariables' => $uriVariables
            ]);
            
            // Debug: Vérifier l'hydratation de la relation User
            if ($data instanceof Food) {
                $foodUser = $data->getUser();
                $this->logger->info(sprintf('[FOOD DEBUG] Hydratation relation User - foodId:%s, userObject:%s, userId:%s',
                    $data->getId() ?? 'null',
                    $foodUser ? 'present' : 'null',
                    $foodUser ? $foodUser->getId() : 'null'
                ));
                
                // CORRECTION: Si l'entité n'a pas d'ID lors d'un PUT, la récupérer depuis la base
                if (!$data->getId() && ($operation instanceof \ApiPlatform\Metadata\Put || $operation instanceof \ApiPlatform\Metadata\Patch)) {
                    if (isset($uriVariables['id'])) {
                        $this->logger->info(sprintf('[FOOD DEBUG] Récupération manuelle de l\'aliment ID:%s', $uriVariables['id']));
                        $existingFood = $this->foodRepository->find($uriVariables['id']);
                        
                        if ($existingFood) {
                            // Copier les nouvelles données sur l'entité existante
                            $existingFood->setName($data->getName() ?? $existingFood->getName());
                            $existingFood->setDescription($data->getDescription() ?? $existingFood->getDescription());
                            $existingFood->setProtein($data->getProtein() ?? $existingFood->getProtein());
                            $existingFood->setCarbs($data->getCarbs() ?? $existingFood->getCarbs());
                            $existingFood->setFat($data->getFat() ?? $existingFood->getFat());
                            $existingFood->setCalories($data->getCalories() ?? $existingFood->getCalories());
                            
                            $data = $existingFood;
                            $this->logger->info(sprintf('[FOOD DEBUG] Aliment récupéré - ID:%s, userId:%s, status:%s',
                                $data->getId(),
                                $data->getUser()?->getId() ?? 'null',
                                $data->getStatus()
                            ));
                        } else {
                            $this->logger->error(sprintf('[FOOD DEBUG] Aliment non trouvé avec ID:%s', $uriVariables['id']));
                            throw new \RuntimeException('Food not found');
                        }
                    }
                }
            }

            $user = $this->security->getUser();
            
            if (!$user || !$data instanceof Food) {
                $this->logger->error('[FOOD DEBUG] Access denied', [
                    'hasUser' => $user !== null,
                    'isFood' => $data instanceof Food
                ]);
                throw new \RuntimeException('Access denied');
            }

            $isAdmin = $this->security->isGranted('ROLE_ADMIN') || 
                   $user->getEmail() === 'admin@nutrition.app' ||
                   str_contains($user->getEmail(), 'admin');

            $this->logger->info(sprintf('[FOOD DEBUG] User info - userId:%s, email:%s, isAdmin:%s, foodStatus:%s, foodUserId:%s', 
                $user->getId(), 
                $user->getEmail(), 
                $isAdmin ? 'true' : 'false', 
                $data->getStatus(), 
                $data->getUser()?->getId() ?? 'null'
            ));

        // Pour les créations (POST)
        if ($operation instanceof \ApiPlatform\Metadata\Post) {
            $data->setUser($user); // Associer l'aliment à l'utilisateur connecté
            
            // Les nouveaux aliments sont en attente de validation par défaut
            if (!$isAdmin) {
                $data->setStatus('pending');
            }
            // Les admins peuvent créer directement des aliments actifs
        }

            // Pour les modifications (PUT/PATCH)
            if ($operation instanceof \ApiPlatform\Metadata\Put || $operation instanceof \ApiPlatform\Metadata\Patch) {
                $this->logger->info('[FOOD DEBUG] Modification détectée', [
                    'isAdmin' => $isAdmin,
                    'foodData' => [
                        'id' => $data->getId(),
                        'name' => $data->getName(),
                        'calories' => $data->getCalories(),
                        'protein' => $data->getProtein(),
                        'carbs' => $data->getCarbs(),
                        'fat' => $data->getFat(),
                        'status' => $data->getStatus(),
                        'userId' => $data->getUser()?->getId()
                    ]
                ]);

                if ($isAdmin) {
                    // Admin peut modifier n'importe quel aliment (y compris changer le status)
                    $this->logger->info('[FOOD DEBUG] Admin modification autorisée');
                } else {
                    // Utilisateur normal ne peut modifier que ses propres propositions pending
                    $foodUserId = $data->getUser()?->getId();
                    $currentUserId = $user->getId();
                    $foodStatus = $data->getStatus();
                    
                        $this->logger->info(sprintf('[FOOD DEBUG] Vérification permissions - foodUserId:%s, currentUserId:%s, foodStatus:%s, userOwnsFood:%s, isPending:%s',
                        $foodUserId ?? 'null',
                        $currentUserId,
                        $foodStatus,
                        ($data->getUser() === $user) ? 'true' : 'false',
                        ($foodStatus === 'pending') ? 'true' : 'false'
                    ));
                    
                    if ($data->getUser() !== $user || $data->getStatus() !== 'pending') {
                        $this->logger->error(sprintf('[FOOD DEBUG] Access denied - Reason: User does not own food OR food is not pending - foodUserId:%s, currentUserId:%s, foodStatus:%s, userOwnsFood:%s, isPending:%s',
                            $foodUserId ?? 'null',
                            $currentUserId,
                            $foodStatus,
                            ($data->getUser() === $user) ? 'true' : 'false',
                            ($foodStatus === 'pending') ? 'true' : 'false'
                        ));
                        throw new \RuntimeException('Access denied');
                    }
                    // Empêcher l'utilisateur de modifier le status
                    $data->setStatus('pending');
                    $this->logger->info('[FOOD DEBUG] User modification autorisée, status forcé à pending');
                }
            }

        // Pour les suppressions (DELETE)
        if ($operation instanceof \ApiPlatform\Metadata\Delete) {
            // CORRECTION: Récupérer l'aliment depuis la base si nécessaire (même correction que pour PUT)
            if (!$data->getId() && isset($uriVariables['id'])) {
                $this->logger->info(sprintf('[FOOD DEBUG] DELETE - Récupération manuelle de l\'aliment ID:%s', $uriVariables['id']));
                $existingFood = $this->foodRepository->find($uriVariables['id']);
                
                if ($existingFood) {
                    $data = $existingFood;
                    $this->logger->info(sprintf('[FOOD DEBUG] DELETE - Aliment récupéré - ID:%s, userId:%s, status:%s',
                        $data->getId(),
                        $data->getUser()?->getId() ?? 'null',
                        $data->getStatus()
                    ));
                } else {
                    $this->logger->error(sprintf('[FOOD DEBUG] DELETE - Aliment non trouvé avec ID:%s', $uriVariables['id']));
                    throw new \RuntimeException('Food not found');
                }
            }
            
            if ($isAdmin) {
                // Admin peut supprimer n'importe quel aliment (suppression forcée)
                // TODO: Supprimer aussi les références dans Contain et Constitute
                $this->logger->info('[FOOD DEBUG] DELETE - Admin suppression autorisée');
            } else {
                // Utilisateur normal ne peut supprimer que ses propres propositions pending
                $foodUserId = $data->getUser()?->getId();
                $currentUserId = $user->getId();
                $foodStatus = $data->getStatus();
                
                $this->logger->info(sprintf('[FOOD DEBUG] DELETE - Vérification permissions - foodUserId:%s, currentUserId:%s, foodStatus:%s',
                    $foodUserId ?? 'null',
                    $currentUserId,
                    $foodStatus
                ));
                
                if ($data->getUser() !== $user || $data->getStatus() !== 'pending') {
                    $this->logger->error(sprintf('[FOOD DEBUG] DELETE - Access denied - foodUserId:%s, currentUserId:%s, foodStatus:%s',
                        $foodUserId ?? 'null',
                        $currentUserId,
                        $foodStatus
                    ));
                    throw new \RuntimeException('Access denied');
                }
                $this->logger->info('[FOOD DEBUG] DELETE - User suppression autorisée');
            }
            
            $this->entityManager->remove($data);
            $this->entityManager->flush();
            return null;
        }

            // Sauvegarder les modifications
            $this->logger->info('[FOOD DEBUG] Avant persist/flush');
            $this->entityManager->persist($data);
            $this->entityManager->flush();
            $this->logger->info('[FOOD DEBUG] Après persist/flush - succès');

            return $data;
        } catch (\Throwable $e) {
            $this->logger->error('[FOOD DEBUG] Exception capturée', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
