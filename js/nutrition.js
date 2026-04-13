// ============================================================
// nutrition.js — Calculation engine for macros
// ============================================================

/**
 * Calculate nutrition for a given food at a given gram weight.
 * All food values are stored per 100g.
 */
function calcNutrition(food, grams) {
  const factor = grams / 100;
  return {
    calories: round2(food.calories * factor),
    protein:  round2(food.protein  * factor),
    carbs:    round2(food.carbs    * factor),
    fat:      round2(food.fat      * factor),
    fiber:    round2((food.fiber || 0) * factor)
  };
}

/**
 * Resolve a portion label to grams.
 * Checks food-specific portions first, then user portion settings.
 */
function resolvePortionGrams(portionLabel, food, userPortions) {
  // Check food's own defaultPortions
  if (food.defaultPortions) {
    for (const [key, grams] of Object.entries(food.defaultPortions)) {
      if (key.toLowerCase() === portionLabel.toLowerCase()) return grams;
    }
  }

  // Check user portions (by portion name keyword)
  const lbl = portionLabel.toLowerCase();
  for (const [key, grams] of Object.entries(userPortions)) {
    if (lbl.includes(key.toLowerCase())) return grams;
  }

  return null;
}

/**
 * Sum totals for an array of log entries given the food list.
 */
function sumLogTotals(entries, foods) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  for (const entry of entries) {
    const food = foods.find(f => f.id === entry.foodId);
    if (!food) continue;
    const n = calcNutrition(food, entry.grams);
    totals.calories += n.calories;
    totals.protein  += n.protein;
    totals.carbs    += n.carbs;
    totals.fat      += n.fat;
    totals.fiber    += n.fiber;
  }
  // Round finals
  for (const k in totals) totals[k] = round2(totals[k]);
  return totals;
}

/**
 * Get status label based on calorie ratio
 */
function getCalorieStatus(consumed, target) {
  const ratio = consumed / target;
  if (ratio >= 0.95 && ratio <= 1.05) return { label: 'ON TRACK',       class: 'status-good' };
  if (ratio > 1.05)                   return { label: 'OVER CALORIES',  class: 'status-over' };
  if (ratio >= 0.7)                   return { label: 'UNDER TARGET',   class: 'status-under' };
  return                                     { label: 'LOW INTAKE',     class: 'status-low' };
}

/**
 * Macro distribution as percentages of calories
 */
function getMacroPercents(totals) {
  const total = (totals.protein * 4) + (totals.carbs * 4) + (totals.fat * 9);
  if (total === 0) return { protein: 0, carbs: 0, fat: 0 };
  return {
    protein: Math.round((totals.protein * 4 / total) * 100),
    carbs:   Math.round((totals.carbs   * 4 / total) * 100),
    fat:     Math.round((totals.fat     * 9 / total) * 100)
  };
}

function round2(n) {
  return Math.round(n * 10) / 10;
}

/**
 * Clamp progress bar value to 0–100
 */
function progressPct(consumed, target) {
  if (!target) return 0;
  return Math.min(100, Math.round((consumed / target) * 100));
}

/**
 * Format number nicely: 1234.5 → "1,234.5"
 */
function fmtNum(n, decimals = 1) {
  return parseFloat(n.toFixed(decimals)).toLocaleString();
}
