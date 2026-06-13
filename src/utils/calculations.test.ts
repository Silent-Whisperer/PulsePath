import { describe, test, expect } from 'vitest';
import { calculateFootprint } from './calculations';
import { AssessmentData } from '../types';

// Mock data setups
const mockMetricData: AssessmentData = {
  transportation: { mileage: 10000, type: 'gas' },
  travel: { shortFlights: 2, longFlights: 1 },
  energy: { electricityMonthly: 300, heatingSource: 'gas', houseSize: 'medium', renewableEnergy: 0 },
  food: { diet: 'meat', localSourcing: 20, foodWaste: 'medium' },
  shopping: { frequency: 'medium', clothingFreq: 'medium' },
  waste: { recycling: true, composting: false },
};

const mockImperialData: AssessmentData = {
  transportation: { mileage: 6213.71, type: 'electric' }, // equivalent to 10000 km
  travel: { shortFlights: 0, longFlights: 0 },
  energy: { electricityMonthly: 150, heatingSource: 'electric', houseSize: 'apartment', renewableEnergy: 50 },
  food: { diet: 'vegan', localSourcing: 50, foodWaste: 'low' },
  shopping: { frequency: 'low', clothingFreq: 'low' },
  waste: { recycling: true, composting: true },
};

describe('CarbonBuddy AI calculation tests', () => {
  
  test('Metric calculations - breakdown categories and percentage sum', () => {
    const results = calculateFootprint(mockMetricData, 'metric');
    
    expect(results.breakdown).toHaveLength(6);
    expect(results.totalEmissions).toBeGreaterThan(0);
    
    const sumPercentage = results.breakdown.reduce((acc, curr) => acc + curr.percentage, 0);
    expect(Math.abs(sumPercentage - 100)).toBeLessThan(0.1);

    const transport = results.breakdown.find(b => b.category === 'Transportation');
    expect(transport).toBeDefined();
    expect(transport!.value).toBe(Math.round(10000 * 0.19));
  });

  test('Imperial calculations and unit scaling', () => {
    const metricResults = calculateFootprint(mockImperialData, 'metric');
    const imperialResults = calculateFootprint(mockImperialData, 'imperial');

    // 6213.71 miles in imperial mode converted to km is ~10,000 km.
    // 10,000 km * 0.05 (electric factor) = 500 kg CO2.
    // In metric mode, 6213.71 km * 0.05 = 310.68 kg CO2.
    // Difference between imperial results and metric results is the scale difference.
    const diff = imperialResults.totalEmissions - metricResults.totalEmissions;
    expect(Math.abs(diff - 189)).toBeLessThanOrEqual(2);

    expect(metricResults.metrics.drivingEquivalent).toBeGreaterThan(0);
    expect(metricResults.metrics.treesEquivalent).toBeGreaterThan(0);
    expect(metricResults.metrics.homeEnergyEquivalent).toBeGreaterThan(0);
  });

  test('Home Energy heating sources, size factors, and renewable power mix', () => {
    const baselineData: AssessmentData = {
      transportation: { mileage: 0, type: 'bike' },
      travel: { shortFlights: 0, longFlights: 0 },
      energy: { electricityMonthly: 0, heatingSource: 'gas', houseSize: 'small', renewableEnergy: 0 },
      food: { diet: 'vegan', localSourcing: 100, foodWaste: 'low' },
      shopping: { frequency: 'low', clothingFreq: 'low' },
      waste: { recycling: true, composting: true },
    };

    // Heating factors: gas (2000), electric (1500), oil (2500), wood (800)
    // House sizes: apartment (0.7), small (1), medium (1.5), large (2.2)
    
    // Gas heat + small house = 2000 * 1 = 2000 kg CO2
    const resGas = calculateFootprint({
      ...baselineData,
      energy: { ...baselineData.energy, heatingSource: 'gas', houseSize: 'small' }
    });
    const energyGas = resGas.breakdown.find(b => b.category === 'Home Energy')!.value;
    expect(energyGas).toBe(2000);

    // Oil heat + large house = 2500 * 2.2 = 5500 kg CO2
    const resOil = calculateFootprint({
      ...baselineData,
      energy: { ...baselineData.energy, heatingSource: 'oil', houseSize: 'large' }
    });
    const energyOil = resOil.breakdown.find(b => b.category === 'Home Energy')!.value;
    expect(energyOil).toBe(5500);

    // Renewable energy reduction: 60% green offset
    const resRenewable = calculateFootprint({
      ...baselineData,
      energy: { ...baselineData.energy, heatingSource: 'gas', houseSize: 'small', renewableEnergy: 60 }
    });
    const energyRenewable = resRenewable.breakdown.find(b => b.category === 'Home Energy')!.value;
    expect(energyRenewable).toBe(Math.round(2000 * 0.4));
  });

  test('Food diet factors, local sourcing and waste multipliers', () => {
    const baselineData: AssessmentData = {
      transportation: { mileage: 0, type: 'bike' },
      travel: { shortFlights: 0, longFlights: 0 },
      energy: { electricityMonthly: 0, heatingSource: 'wood', houseSize: 'apartment', renewableEnergy: 100 },
      food: { diet: 'heavy-meat', localSourcing: 0, foodWaste: 'medium' },
      shopping: { frequency: 'low', clothingFreq: 'low' },
      waste: { recycling: true, composting: true },
    };

    // Diet factors: heavy-meat (3300), meat (2500), vegetarian (1700), vegan (1500)
    // Local sourcing scale: 1 - (localSourcing / 200) -> 0% is 1.0, 100% is 0.5
    // Waste factors: low (0.9), medium (1.1), high (1.4)
    
    // Heavy-meat + 0% local + medium waste = 3300 * 1 * 1.1 = 3630 kg CO2
    const resHeavy = calculateFootprint(baselineData);
    const foodHeavy = resHeavy.breakdown.find(b => b.category === 'Food')!.value;
    expect(foodHeavy).toBe(3630);

    // Vegan + 100% local + low waste = 1500 * 0.5 * 0.9 = 675 kg CO2
    const resVegan = calculateFootprint({
      ...baselineData,
      food: { diet: 'vegan', localSourcing: 100, foodWaste: 'low' }
    });
    const foodVegan = resVegan.breakdown.find(b => b.category === 'Food')!.value;
    expect(foodVegan).toBe(675);
  });

  test('Shopping levels, waste management recycling and composting offsets', () => {
    const baselineData: AssessmentData = {
      transportation: { mileage: 0, type: 'bike' },
      travel: { shortFlights: 0, longFlights: 0 },
      energy: { electricityMonthly: 0, heatingSource: 'wood', houseSize: 'apartment', renewableEnergy: 100 },
      food: { diet: 'vegan', localSourcing: 100, foodWaste: 'low' },
      shopping: { frequency: 'low', clothingFreq: 'low' },
      waste: { recycling: false, composting: false },
    };

    // Shopping factors: low (800), medium (2000), high (4500)
    // Clothing factors: low (200), medium (500), high (1200)
    // Waste: base 500, recycling (-150), composting (-100)

    // Shopping low + clothing low = 800 + 200 = 1000 kg CO2
    const resShop = calculateFootprint(baselineData);
    const shopEmissions = resShop.breakdown.find(b => b.category === 'Shopping')!.value;
    expect(shopEmissions).toBe(1000);

    // Waste baseline = 500 kg CO2
    const wasteBase = resShop.breakdown.find(b => b.category === 'Waste')!.value;
    expect(wasteBase).toBe(500);

    // Waste with recycling and composting = 500 - 150 - 100 = 250 kg CO2
    const resWasteFull = calculateFootprint({
      ...baselineData,
      waste: { recycling: true, composting: true }
    });
    const wasteFull = resWasteFull.breakdown.find(b => b.category === 'Waste')!.value;
    expect(wasteFull).toBe(250);
  });

  test('Air Travel short and long haul emissions', () => {
    const baselineData: AssessmentData = {
      transportation: { mileage: 0, type: 'bike' },
      travel: { shortFlights: 3, longFlights: 2 },
      energy: { electricityMonthly: 0, heatingSource: 'wood', houseSize: 'apartment', renewableEnergy: 100 },
      food: { diet: 'vegan', localSourcing: 100, foodWaste: 'low' },
      shopping: { frequency: 'low', clothingFreq: 'low' },
      waste: { recycling: true, composting: true },
    };

    // shortFlights (150 each), longFlights (800 each)
    // 3 * 150 + 2 * 800 = 450 + 1600 = 2050 kg CO2
    const results = calculateFootprint(baselineData);
    const travel = results.breakdown.find(b => b.category === 'Air Travel')!.value;
    expect(travel).toBe(2050);
  });

  test('High impact action logic and AI insights', () => {
    const results = calculateFootprint(mockMetricData, 'metric');
    
    expect(results.topActions).toBeDefined();
    expect(results.topActions.length).toBeLessThanOrEqual(3);
    
    // Sorted descending by co2Saved
    for (let i = 0; i < results.topActions.length - 1; i++) {
      expect(results.topActions[i].co2Saved).toBeGreaterThanOrEqual(results.topActions[i + 1].co2Saved);
    }

    expect(results.aiInsight).toBeTypeOf('string');
    expect(results.aiInsight.length).toBeGreaterThan(0);
  });

  test('Edge cases - minimum values (all zero/bike/vegan/minimalist)', () => {
    const minData: AssessmentData = {
      transportation: { mileage: 0, type: 'bike' },
      travel: { shortFlights: 0, longFlights: 0 },
      energy: { electricityMonthly: 0, heatingSource: 'wood', houseSize: 'apartment', renewableEnergy: 100 },
      food: { diet: 'vegan', localSourcing: 100, foodWaste: 'low' },
      shopping: { frequency: 'low', clothingFreq: 'low' },
      waste: { recycling: true, composting: true },
    };

    const results = calculateFootprint(minData, 'metric');
    expect(results.totalEmissions).toBeGreaterThan(0);
    // Home Energy should be 800 * 0.7 * 0 = 0
    expect(results.breakdown.find(b => b.category === 'Home Energy')!.value).toBe(0);
    // Food should be 1500 * 0.5 * 0.9 = 675
    expect(results.breakdown.find(b => b.category === 'Food')!.value).toBe(675);
    // Waste should be 500 - 150 - 100 = 250
    expect(results.breakdown.find(b => b.category === 'Waste')!.value).toBe(250);
  });
});
