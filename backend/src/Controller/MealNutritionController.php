<?php
namespace App\Controller;

use App\Entity\Meal;
use App\Service\NutritionCalculator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class MealNutritionController extends AbstractController
{
    #[Route('/api/v1/meals/{id}/nutrition', name: 'meal_nutrition', methods: ['GET'])]
    public function __invoke(Meal $meal, NutritionCalculator $calculator): JsonResponse
    {
        $totals = $calculator->calculateMealNutrition($meal);
        return $this->json($totals);
    }
}
