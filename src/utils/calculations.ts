/**
 * @file calculations.ts
 * @description Core footprint engine for CarbonBuddy AI.
 * Translates lifestyle questionnaire parameters into greenhouse gas (GHG) emission values,
 * following standards set by the IPCC (Intergovernmental Panel on Climate Change) and WWF.
 */

import { AssessmentData, CarbonResults, HighImpactAction, EmissionBreakpoint } from '../types';

/**
 * Calculates the annual carbon footprint estimate based on lifestyle assessment data.
 * Supports both metric and imperial input formats and converts values internally for consistency.
 *
 * @param data AssessmentData - The inputs from the user questionnaire.
 * @param units 'metric' | 'imperial' - The active unit system.
 * @returns CarbonResults - Total CO2, segmented breakdown, recommended actions, and equivalents.
 */
export function calculateFootprint(data: AssessmentData, units: 'metric' | 'imperial' = 'metric'): CarbonResults {
  const breakdown: EmissionBreakpoint[] = [];
  
  // ==========================================
  // 1. Transportation Carbon Calculations
  // ==========================================
  // Factors represent kg of CO2 equivalent (CO2e) emitted per kilometer driven.
  // Sources: standard EPA and Greenhouse Gas Protocol vehicle emissions tables.
  const transFactors = { 
    gas: 0.19,     // Standard gasoline internal combustion engine (ICE)
    hybrid: 0.12,  // Hybrid gas-electric vehicle
    electric: 0.05, // Battery electric vehicle (average grid intensity factor for charging)
    public: 0.04,  // Public transit (bus, train average passenger-km)
    bike: 0        // Walking, cycling, e-scooter (near-zero operating emissions)
  };
  
  // If units are imperial (miles), convert to kilometers for baseline metric formulas.
  // Conversion constant: 1 mile = 1.60934 kilometers.
  const mileage = units === 'imperial' ? data.transportation.mileage * 1.60934 : data.transportation.mileage;
  const transportationEmissions = mileage * transFactors[data.transportation.type];
  
  // ==========================================
  // 2. Home Energy Carbon Calculations
  // ==========================================
  // Heating baselines: annual average emissions in kg CO2 based on energy fuel types.
  const heatFactors = { 
    gas: 2000,      // Natural gas heating
    electric: 1500, // Electric baseboard / heat pump average grid load
    oil: 2500,      // Heating oil (highly carbon-intensive)
    wood: 800       // Biomass heating (lower net fossil carbon, but high particulate load)
  };
  
  // Scale factors for residential floor areas (house sizes).
  const sizeFactors = { 
    apartment: 0.7, // Minimal area to heat/cool
    small: 1,       // Small single-family home
    medium: 1.5,    // Average suburban house
    large: 2.2      // Large property
  };
  
  // Electricity calculation: monthly consumption (kWh) * 12 months * grid emission factor (0.4 kg CO2e / kWh).
  let energyEmissions = (data.energy.electricityMonthly * 12 * 0.4) + heatFactors[data.energy.heatingSource];
  
  // Adjust base energy calculations by house size.
  energyEmissions *= sizeFactors[data.energy.houseSize];
  
  // Apply clean/renewable power offset (e.g. 100% green energy plan reduces electrical intensity to near-zero).
  energyEmissions *= (1 - (data.energy.renewableEnergy / 100));

  // ==========================================
  // 3. Food & Diet Carbon Calculations
  // ==========================================
  // Annual average footprint in kg CO2 based on food lifecycle database metrics (production + transport).
  // Methane from livestock makes meat-heavy diets significantly more impactful.
  const dietFactors = { 
    'heavy-meat': 3300, 
    'meat': 2500, 
    'vegetarian': 1700, 
    'vegan': 1500 
  };
  
  // Food waste scaling factors. High waste adds to landfill methane load.
  const wasteFactors = { 
    low: 0.9, 
    medium: 1.1, 
    high: 1.4 
  };
  
  // Local sourcing discount (reduces food miles transit emissions up to 50% max).
  const foodEmissions = dietFactors[data.food.diet] * (1 - (data.food.localSourcing / 200)) * wasteFactors[data.food.foodWaste];
  
  // ==========================================
  // 4. Shopping & Retail Consumption Calculations
  // ==========================================
  // Industrial manufacturing and shipping emissions from general goods and clothing.
  const shopFactors = { 
    low: 800,      // Minimalist purchase patterns
    medium: 2000,  // Average retail consumption
    high: 4500     // Fast-fashion and frequent luxury buying
  };
  const clothFactors = { 
    low: 200, 
    medium: 500, 
    high: 1200 
  };
  const shoppingEmissions = shopFactors[data.shopping.frequency] + clothFactors[data.shopping.clothingFreq];
  
  // ==========================================
  // 5. Waste Disposal Calculations
  // ==========================================
  // Baseline trash output is ~500 kg CO2/year. 
  // Diverting items reduces anaerobic digestion and landfill methane emissions.
  let wasteEmissions = 500;
  if (data.waste.recycling) wasteEmissions -= 150;   // Recycling credit
  if (data.waste.composting) wasteEmissions -= 100;  // Composting organic credit

  // ==========================================
  // 6. Air Travel Carbon Calculations
  // ==========================================
  // High-altitude radiative forcing index gives short flights (150kg per trip) 
  // and long-haul international flights (800kg per trip) massive warming weight.
  const travelEmissions = (data.travel.shortFlights * 150) + (data.travel.longFlights * 800);

  // ==========================================
  // 7. Results Aggregation & Actions Generation
  // ==========================================
  const total = transportationEmissions + energyEmissions + foodEmissions + shoppingEmissions + wasteEmissions + travelEmissions;

  breakdown.push({ category: 'Transportation', value: transportationEmissions, percentage: (transportationEmissions / total) * 100 });
  breakdown.push({ category: 'Air Travel', value: travelEmissions, percentage: (travelEmissions / total) * 100 });
  breakdown.push({ category: 'Home Energy', value: energyEmissions, percentage: (energyEmissions / total) * 100 });
  breakdown.push({ category: 'Food', value: foodEmissions, percentage: (foodEmissions / total) * 100 });
  breakdown.push({ category: 'Shopping', value: shoppingEmissions, percentage: (shoppingEmissions / total) * 100 });
  breakdown.push({ category: 'Waste', value: wasteEmissions, percentage: (wasteEmissions / total) * 100 });

  // Generate recommended behavioral interventions sorted by potential carbon savings.
  const allActions = generateActions(data, breakdown);
  const sortedActions = allActions.sort((a, b) => b.co2Saved - a.co2Saved);
  
  const topActions = sortedActions.slice(0, 3);
  const secondaryActions = sortedActions.slice(3);

  // Generate dynamic contextual insight text based on emissions levels.
  const aiInsight = generateAIInsight(total, topActions);

  return {
    totalEmissions: Math.round(total),
    breakdown: breakdown.map(b => ({ ...b, value: Math.round(b.value) })),
    topActions,
    secondaryActions,
    aiInsight,
    metrics: {
      // 1 mature tree absorbs ~20kg CO2 per year.
      treesEquivalent: Math.round(total / 20),
      // Baseline gas vehicle emits 190g/km (0.19kg/km).
      drivingEquivalent: Math.round(total / 0.19),
      // Average household energy baseline (100kg reference).
      homeEnergyEquivalent: Math.round(total / 100),
    }
  };
}

/**
 * Evaluates the carbon segments and suggests actionable behavioral changes.
 * Matches user's specific answers to prevent duplicate or invalid recommendations.
 */
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

/**
 * Computes AI Climate Coach summary insight strings based on emissions thresholds.
 */
function generateAIInsight(total: number, top: HighImpactAction[]): string {
  const avg = 12000; // Average global/developed nation carbon output (12,000 kg CO2 / year)
  if (total > avg) {
    return `Your footprint is currently above the global average. However, your profile suggests high leverage in ${top[0]?.category}. By focusing on just these 3 actions, you can eliminate ${Math.round(top.reduce((a,b) => a + b.co2Saved, 0))}kg CO2 annually.`;
  }
  return `You're already outperforming the majority. To reach the gold standard of 2,000kg/year, your next frontier is optimizing your ${top[0]?.category} habits.`;
}
