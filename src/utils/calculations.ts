import { AssessmentData, CarbonResults, HighImpactAction, EmissionBreakpoint } from '../types';

export function calculateFootprint(data: AssessmentData, units: 'metric' | 'imperial' = 'metric'): CarbonResults {
  const breakdown: EmissionBreakpoint[] = [];
  
  // Transportation
  const transFactors = { gas: 0.19, hybrid: 0.12, electric: 0.05, public: 0.04, bike: 0 };
  const mileage = units === 'imperial' ? data.transportation.mileage * 1.60934 : data.transportation.mileage;
  const transportationEmissions = mileage * transFactors[data.transportation.type];
  
  // Energy
  const heatFactors = { gas: 2000, electric: 1500, oil: 2500, wood: 800 };
  const sizeFactors = { apartment: 0.7, small: 1, medium: 1.5, large: 2.2 };
  let energyEmissions = (data.energy.electricityMonthly * 12 * 0.4) + heatFactors[data.energy.heatingSource];
  energyEmissions *= sizeFactors[data.energy.houseSize];
  energyEmissions *= (1 - (data.energy.renewableEnergy / 100));

  // Food
  const dietFactors = { 'heavy-meat': 3300, 'meat': 2500, 'vegetarian': 1700, 'vegan': 1500 };
  const wasteFactors = { low: 0.9, medium: 1.1, high: 1.4 };
  const foodEmissions = dietFactors[data.food.diet] * (1 - (data.food.localSourcing / 200)) * wasteFactors[data.food.foodWaste];
  
  // Shopping
  const shopFactors = { low: 800, medium: 2000, high: 4500 };
  const clothFactors = { low: 200, medium: 500, high: 1200 };
  const shoppingEmissions = shopFactors[data.shopping.frequency] + clothFactors[data.shopping.clothingFreq];
  
  // Waste
  let wasteEmissions = 500;
  if (data.waste.recycling) wasteEmissions -= 150;
  if (data.waste.composting) wasteEmissions -= 100;

  // Air Travel
  const travelEmissions = (data.travel.shortFlights * 150) + (data.travel.longFlights * 800);

  const total = transportationEmissions + energyEmissions + foodEmissions + shoppingEmissions + wasteEmissions + travelEmissions;

  breakdown.push({ category: 'Transportation', value: transportationEmissions, percentage: (transportationEmissions / total) * 100 });
  breakdown.push({ category: 'Air Travel', value: travelEmissions, percentage: (travelEmissions / total) * 100 });
  breakdown.push({ category: 'Home Energy', value: energyEmissions, percentage: (energyEmissions / total) * 100 });
  breakdown.push({ category: 'Food', value: foodEmissions, percentage: (foodEmissions / total) * 100 });
  breakdown.push({ category: 'Shopping', value: shoppingEmissions, percentage: (shoppingEmissions / total) * 100 });
  breakdown.push({ category: 'Waste', value: wasteEmissions, percentage: (wasteEmissions / total) * 100 });

  const allActions = generateActions(data, breakdown);
  const sortedActions = allActions.sort((a, b) => b.co2Saved - a.co2Saved);
  
  const topActions = sortedActions.slice(0, 3);
  const secondaryActions = sortedActions.slice(3);

  const aiInsight = generateAIInsight(total, topActions);

  return {
    totalEmissions: Math.round(total),
    breakdown: breakdown.map(b => ({ ...b, value: Math.round(b.value) })),
    topActions,
    secondaryActions,
    aiInsight,
    metrics: {
      treesEquivalent: Math.round(total / 20),
      drivingEquivalent: Math.round(total / 0.19),
      homeEnergyEquivalent: Math.round(total / 100),
    }
  };
}

function generateActions(data: AssessmentData, breakdown: EmissionBreakpoint[]): HighImpactAction[] {
  const actions: HighImpactAction[] = [];
  
  breakdown.forEach(cat => {
    if (cat.category === 'Transportation' && data.transportation.type !== 'bike') {
      actions.push({
        id: 'act-1',
        title: 'Micro-Mobility Flip',
        description: 'Replace 30% of car trips with an e-bike or cycling.',
        impactWeight: 85,
        co2Saved: Math.round(cat.value * 0.3),
        category: 'transportation',
        effort: 'Moderate',
        narrative: "Your car usage is your primary lever. In urban settings, e-bikes are often faster and cut local emissions to near zero."
      });
    }
    if (cat.category === 'Air Travel' && (data.travel.shortFlights > 0 || data.travel.longFlights > 0)) {
      actions.push({
        id: 'act-2',
        title: 'The Slow Travel Shift',
        description: 'Replace one long-haul flight with a local train-based itinerary.',
        impactWeight: 95,
        co2Saved: data.travel.longFlights > 0 ? 800 : 300,
        category: 'travel',
        effort: 'Hard',
        narrative: "A single flight can undo months of recycling. Prioritizing one 'Staycation' or train trip per year is the single biggest individual win."
      });
    }
    if (cat.category === 'Home Energy' && data.energy.renewableEnergy < 100) {
      actions.push({
        id: 'act-3',
        title: 'Green Utility Switch',
        description: 'Switch your power provider to a 100% renewable plan.',
        impactWeight: 90,
        co2Saved: Math.round(cat.value * 0.8),
        category: 'energy',
        effort: 'Easy',
        narrative: "The 'Invisible' fix. Switching providers takes 10 minutes and removes the carbon intensity of your entire home electronics fleet."
      });
    }
    if (cat.category === 'Food' && data.food.diet !== 'vegan') {
      actions.push({
        id: 'act-4',
        title: 'Plant-First Protocol',
        description: 'Shift to a plant-based diet for weekdays.',
        impactWeight: 75,
        co2Saved: Math.round(cat.value * 0.25),
        category: 'food',
        effort: 'Moderate',
        narrative: "Agriculture is high-impact. Moving meat to a 'special occasion' status rather than a daily staple significantly drops your methane contribution."
      });
    }
    if (cat.category === 'Shopping' && data.shopping.frequency !== 'low') {
      actions.push({
        id: 'act-5',
        title: 'Circular Shopping',
        description: 'Commit to buying only pre-owned for the next 6 months.',
        impactWeight: 70,
        co2Saved: Math.round(cat.value * 0.4),
        category: 'shopping',
        effort: 'Moderate',
        narrative: "Manufacturing new goods consumes massive amounts of industrial energy. Thrift-first shopping breaks the fast-fashion cycle."
      });
    }
  });

  return actions;
}

function generateAIInsight(total: number, top: HighImpactAction[]): string {
  const avg = 12000;
  if (total > avg) {
    return `Your footprint is currently above the global average. However, your profile suggests high leverage in ${top[0]?.category}. By focusing on just these 3 actions, you can eliminate ${Math.round(top.reduce((a,b) => a + b.co2Saved, 0))}kg CO2 annually.`;
  }
  return `You're already outperforming the majority. To reach the gold standard of 2,000kg/year, your next frontier is optimizing your ${top[0]?.category} habits.`;
}
