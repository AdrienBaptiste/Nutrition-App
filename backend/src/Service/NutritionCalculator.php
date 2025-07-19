<?php
namespace App\Service;

use App\Entity\Dish;
use App\Entity\Meal;

class NutritionCalculator
{
    public function calculateDishNutrition(Dish $dish): array
    {
        $totals = ['calories' => 0, 'protein' => 0, 'carbs' => 0, 'fat' => 0];
        foreach ($dish->getContains() as $contain) {
            $food = $contain->getFood();
            if ($food) {
                $quantity = $contain->getQuantity() ?? 0;
                $totals['calories'] += $food->getCalories() * ($quantity / 100);
                $totals['protein']  += $food->getProtein() * ($quantity / 100);
                $totals['carbs']    += $food->getCarbs() * ($quantity / 100);
                $totals['fat']      += $food->getFat() * ($quantity / 100);
            }
        }
        return $totals;
    }

    public function calculateMealNutrition(Meal $meal): array
    {
        $totals = ['calories' => 0, 'protein' => 0, 'carbs' => 0, 'fat' => 0];
        foreach ($meal->getConstitutes() as $constitute) {
            // Aliments directs
            if ($constitute->getFood()) {
                $food = $constitute->getFood();
                $quantity = $constitute->getFoodQuantity() ?? 0;
                $totals['calories'] += $food->getCalories() * ($quantity / 100);
                $totals['protein']  += $food->getProtein() * ($quantity / 100);
                $totals['carbs']    += $food->getCarbs() * ($quantity / 100);
                $totals['fat']      += $food->getFat() * ($quantity / 100);
            }
            // Plats (Dish)
            if ($constitute->getDish()) {
                $dish = $constitute->getDish();
                $dishNutrition = $this->calculateDishNutrition($dish);
                $portion = $constitute->getDishQuantity() ?? 1;
                foreach ($dishNutrition as $key => $value) {
                    $totals[$key] += $value * $portion;
                }
            }
        }
        // Arrondir à 2 décimales
        foreach ($totals as $k => $v) {
            $totals[$k] = round($v, 2);
        }
        return $totals;
    }
}

