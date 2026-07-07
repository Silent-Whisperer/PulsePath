/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'fan' | 'volunteer' | 'operations' | 'accessibility';

export type Language = 'en' | 'es' | 'fr' | 'hi' | 'ar';

export interface StadiumZone {
  id: string;
  name: string;
  capacity: number;
  currentDensity: number; // 0 to 1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  polygon: [number, number][]; // Lat/Lng coordinates
}

export interface Gate {
  id: string;
  name: string;
  status: 'open' | 'closed' | 'restricted';
  throughput: number; // people per minute
  currentQueueTime: number; // minutes
  location: [number, number];
  accessibilityFeatures: string[];
}

export interface Incident {
  id: string;
  type: 'medical' | 'security' | 'crowd' | 'technical' | 'weather' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: [number, number];
  zoneId: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'in-progress' | 'resolved';
  assignedStaff?: string;
  aiRecommendation?: string;
}

export interface TransitRoute {
  id: string;
  type: 'shuttle' | 'metro' | 'bus' | 'train';
  name: string;
  status: 'on-time' | 'delayed' | 'suspended';
  frequency: number; // minutes
  nextArrival: string;
  loadFactor: number; // 0 to 1
  stations: { name: string; location: [number, number] }[];
}

export interface Vendor {
  id: string;
  name: string;
  type: 'food' | 'merchandise' | 'service';
  location: [number, number];
  queueTime: number; // minutes
  specialties: string[];
  isSustainable: boolean;
  isAccessible: boolean;
}

export interface SimulationState {
  scenario: string;
  timeMultiplier: number;
  isPaused: boolean;
  weather: {
    temp: number;
    condition: 'sunny' | 'rainy' | 'windy' | 'stormy';
    visibility: number;
  };
  globalDensity: number;
  transitReliability: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  location: [number, number];
  status: 'pending' | 'active' | 'completed';
  type: 'assistance' | 'safety' | 'operations';
  priority: 'low' | 'medium' | 'high';
}

export interface SustainabilityStats {
  bottlesSaved: number;
  carbonSaved: number; // kg
  stepsTaken: number;
  points: number;
}
