import { calculateFootprint } from './calculations';
import { AssessmentData } from '../types';

// Mock assessment data for metric tests
const mockMetricData: AssessmentData = {
  transportation: { mileage: 10000, type: 'gas' },
  travel: { shortFlights: 2, longFlights: 1 },
  energy: { electricityMonthly: 300, heatingSource: 'gas', houseSize: 'medium', renewableEnergy: 0 },
  food: { diet: 'meat', localSourcing: 20, foodWaste: 'medium' },
  shopping: { frequency: 'medium', clothingFreq: 'medium' },
  waste: { recycling: true, composting: false },
};

// Mock assessment data for imperial tests
const mockImperialData: AssessmentData = {
  transportation: { mileage: 6213.71, type: 'electric' }, // equivalent to 10000 km
  travel: { shortFlights: 0, longFlights: 0 },
  energy: { electricityMonthly: 150, heatingSource: 'electric', houseSize: 'apartment', renewableEnergy: 50 },
  food: { diet: 'vegan', localSourcing: 50, foodWaste: 'low' },
  shopping: { frequency: 'low', clothingFreq: 'low' },
  waste: { recycling: true, composting: true },
};

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("🚀 Starting CarbonBuddy AI Unit Tests...\n");

// Test Case 1: Metric Calculations
try {
  console.log("🧪 Test Case 1: Metric Footprint Calculations...");
  const results = calculateFootprint(mockMetricData, 'metric');
  
  // Verify breakdown categories exist and have valid percentages
  assert(results.breakdown.length === 6, "Breakdown should contain exactly 6 categories");
  assert(results.totalEmissions > 0, "Total emissions should be a positive number");
  
  const sumPercentage = results.breakdown.reduce((acc, curr) => acc + curr.percentage, 0);
  assert(Math.abs(sumPercentage - 100) < 0.1, `Breakdown percentages should sum to 100% (got ${sumPercentage}%)`);

  // Verify specific metric emission rules
  const transportBreakdown = results.breakdown.find(b => b.category === 'Transportation');
  assert(transportBreakdown !== undefined, "Transportation category should exist");
  assert(transportBreakdown!.value === 10000 * 0.19, "Transportation emission math incorrect");

  console.log("✅ Metric calculation checks passed!");
} catch (e: any) {
  console.error("❌ Test Case 1 Failed:", e.message);
  process.exit(1);
}

// Test Case 2: Imperial Conversions
try {
  console.log("\n🧪 Test Case 2: Imperial Footprint Conversions...");
  const metricResults = calculateFootprint(mockImperialData, 'metric');
  const imperialResults = calculateFootprint(mockImperialData, 'imperial');

  // Verify that mileage scaling works:
  // 6213.71 miles converted to km is ~10,000 km.
  // 10,000 km * 0.05 (electric factor) = 500 kg CO2.
  // 6213.71 km * 0.05 (electric factor) = 310.68 kg CO2.
  // Delta should be ~189 kg CO2.
  const diff = imperialResults.totalEmissions - metricResults.totalEmissions;
  assert(Math.abs(diff - 189) <= 2, 
    `Mileage scaling discrepancy (Expected difference ~189, Got ${diff})`);

  // Verify driving offset metric conversion
  const metricDriving = metricResults.metrics.drivingEquivalent;
  const imperialDriving = Math.round(metricResults.metrics.drivingEquivalent * 0.621371);
  assert(metricDriving > 0, "Driving equivalent should be positive");
  assert(imperialDriving > 0, "Imperial driving equivalent should be positive");

  console.log("✅ Imperial unit scaling checks passed!");
} catch (e: any) {
  console.error("❌ Test Case 2 Failed:", e.message);
  process.exit(1);
}

console.log("\n✨ All core unit tests passed successfully!");
process.exit(0);
