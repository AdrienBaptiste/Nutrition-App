<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\ConstituteRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ConstituteRepository::class)]
#[ApiResource(
    uriTemplate: '/v1/constitutes',
    operations: [
        new GetCollection(),
        new Post(),
        new Get(uriTemplate: '/v1/constitutes/{id}'),
        new Put(uriTemplate: '/v1/constitutes/{id}'),
        new Delete(uriTemplate: '/v1/constitutes/{id}')
    ],
    formats: ['jsonld' => ['application/ld+json'], 'json' => ['application/json']],
    normalizationContext: ['groups' => ['constitute:read']],
    denormalizationContext: ['groups' => ['constitute:write']],
    security: 'is_granted("ROLE_USER")',
    securityMessage: 'Access denied.',
    provider: 'App\\State\\ConstituteStateProvider',
    processor: 'App\\State\\ConstituteStateProcessor'
)]
class Constitute
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'constitutes')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['constitute:read', 'constitute:write'])]
    private ?Food $food = null;

    #[ORM\ManyToOne(inversedBy: 'constitutes')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['constitute:read', 'constitute:write'])]
    private ?Dish $dish = null;

    #[ORM\ManyToOne(inversedBy: 'constitutes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['constitute:read', 'constitute:write'])]
    private ?Meal $meal = null;

    /**
     * Validation: soit food+food_quantity, soit dish+dish_quantity, mais pas les deux
     */

    #[ORM\Column(nullable: true)]
    #[Groups(['constitute:read', 'constitute:write'])]
    private ?float $food_quantity = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['constitute:read', 'constitute:write'])]
    private ?float $dish_quantity = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFood(): ?Food
    {
        return $this->food;
    }

    public function setFood(?Food $food): static
    {
        $this->food = $food;

        return $this;
    }

    public function getDish(): ?Dish
    {
        return $this->dish;
    }

    public function setDish(?Dish $dish): static
    {
        $this->dish = $dish;

        return $this;
    }

    public function getMeal(): ?Meal
    {
        return $this->meal;
    }

    public function setMeal(?Meal $meal): static
    {
        $this->meal = $meal;

        return $this;
    }

    public function getFoodQuantity(): ?float
    {
        return $this->food_quantity;
    }

    public function setFoodQuantity(float $food_quantity): static
    {
        $this->food_quantity = $food_quantity;

        return $this;
    }

    public function getDishQuantity(): ?float
    {
        return $this->dish_quantity;
    }

    public function setDishQuantity(float $dish_quantity): static
    {
        $this->dish_quantity = $dish_quantity;

        return $this;
    }
}
