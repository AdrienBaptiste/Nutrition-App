<?php
namespace App\Controller;

use App\Entity\Dish;
use App\Service\NutritionCalculator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DishNutritionController extends AbstractController
{
    #[Route('/api/v1/dishes/{id}/nutrition', name: 'dish_nutrition', methods: ['GET'])]
    public function __invoke(Dish $dish, NutritionCalculator $calculator): JsonResponse
    {
        $totals = $calculator->calculateDishNutrition($dish);
        return $this->json($totals);
    }
}
