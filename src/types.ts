export type Category = 'transportation' | 'energy' | 'food' | 'shopping' | 'waste' | 'travel';

export interface AssessmentData {
  transportation: {
    mileage: number; // annual km
    type: 'gas' | 'electric' | 'hybrid' | 'public' | 'bike';
  };
  energy: {
    electricityMonthly: number; // kWh
    heatingSource: 'gas' | 'electric' | 'oil' | 'wood';
    houseSize: 'apartment' | 'small' | 'medium' | 'large';
    renewableEnergy: number; // 0-100%
  };
  food: {
    diet: 'heavy-meat' | 'meat' | 'vegetarian' | 'vegan';
    localSourcing: number; // 0-100
    foodWaste: 'low' | 'medium' | 'high';
  };
  shopping: {
    frequency: 'low' | 'medium' | 'high';
    clothingFreq: 'low' | 'medium' | 'high';
  };
  waste: {
    recycling: boolean;
    composting: boolean;
  };
  travel: {
    shortFlights: number; // flights < 3h
    longFlights: number; // flights > 3h
  };
}

export interface EmissionBreakpoint {
  category: string;
  value: number; // kg CO2e
  percentage: number;
}

export interface HighImpactAction {
  id: string;
  title: string;
  description: string;
  impactWeight: number; // 0-100
  co2Saved: number;
  category: Category;
  effort: 'Easy' | 'Moderate' | 'Hard';
  narrative: string; // AI generated context
}

export interface CarbonResults {
  totalEmissions: number;
  breakdown: EmissionBreakpoint[];
  topActions: HighImpactAction[];
  secondaryActions: HighImpactAction[];
  aiInsight: string;
  metrics: {
    treesEquivalent: number;
    drivingEquivalent: number;
    homeEnergyEquivalent: number;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
