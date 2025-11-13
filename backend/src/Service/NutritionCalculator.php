<?php
namespace App\Service;

use App\Entity\Dish;
use App\Entity\Meal;

/**
 * Service centralisant les calculs nutritionnels pour plats et repas.
 * Gère les relations entre Dish (plat), Food (aliment), Meal (repas),
 * Contain (composition plat) et Constitute (composition repas).
 */
class NutritionCalculator
{
    /**
     * Calcule les valeurs nutritionnelles totales d'un plat (Dish).
     * Parcourt tous les aliments du plat (Contains) et additionne les valeurs
     * proportionnellement à la quantité de chaque aliment (en grammes).
     *
     * Formule : valeur_nutritionnelle_aliment * (quantité / 100)
     * Exemple : 52 kcal/100g * 150g/100 = 78 kcal pour 150g
     */
    /**
     * @return array{calories: float, protein: float, carbs: float, fat: float}
     */
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

    /**
     * Calcule la nutrition totale d'un repas (Meal).
     * Un repas peut contenir :
     *  - des aliments directs (avec quantité en grammes)
     *  - des plats (Dish) avec nombre de portions
     * Pour chaque plat, appelle calculateDishNutrition pour obtenir la nutrition d'une portion,
     * puis multiplie par le nombre de portions.
     * Les totaux sont arrondis à 2 décimales pour l'affichage.
     */
    /**
     * @return array{calories: float, protein: float, carbs: float, fat: float}
     */
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

