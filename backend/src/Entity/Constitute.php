<?php

namespace App\Entity;

use App\Repository\ConstituteRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ConstituteRepository::class)]
class Constitute
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Food $food = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Dish $dish = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Meal $meal = null;

    #[ORM\Column]
    private ?float $food_quantity = null;

    #[ORM\Column]
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
