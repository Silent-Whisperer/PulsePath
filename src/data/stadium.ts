/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StadiumZone, Gate, Vendor, TransitRoute } from '../types';

export const STADIUM_CENTER: [number, number] = [19.3029, -99.1505]; // Estadio Azteca as reference

export const ZONES: StadiumZone[] = [
  {
    id: 'north-lower',
    name: 'North Lower Concourse',
    capacity: 12000,
    currentDensity: 0.45,
    riskLevel: 'low',
    polygon: [
      [19.304, -99.151],
      [19.304, -99.15],
      [19.303, -99.15],
      [19.303, -99.151],
    ],
  },
  {
    id: 'east-upper',
    name: 'East Upper Deck',
    capacity: 15000,
    currentDensity: 0.82,
    riskLevel: 'high',
    polygon: [
      [19.303, -99.149],
      [19.302, -99.149],
      [19.302, -99.15],
      [19.303, -99.15],
    ],
  },
  {
    id: 'west-vip',
    name: 'West VIP Lounge',
    capacity: 5000,
    currentDensity: 0.3,
    riskLevel: 'low',
    polygon: [
      [19.303, -99.152],
      [19.302, -99.152],
      [19.302, -99.151],
      [19.303, -99.151],
    ],
  },
  {
    id: 'south-fan-zone',
    name: 'South Fan Zone',
    capacity: 20000,
    currentDensity: 0.65,
    riskLevel: 'medium',
    polygon: [
      [19.302, -99.151],
      [19.302, -99.15],
      [19.301, -99.15],
      [19.301, -99.151],
    ],
  },
];

export const GATES: Gate[] = [
  {
    id: 'gate-a',
    name: 'Gate A (North)',
    status: 'open',
    throughput: 120,
    currentQueueTime: 12,
    location: [19.3045, -99.1505],
    accessibilityFeatures: ['ramps', 'elevators', 'braille-signs'],
  },
  {
    id: 'gate-b',
    name: 'Gate B (East)',
    status: 'restricted',
    throughput: 45,
    currentQueueTime: 35,
    location: [19.3029, -99.1485],
    accessibilityFeatures: ['ramps'],
  },
  {
    id: 'gate-c',
    name: 'Gate C (South)',
    status: 'open',
    throughput: 210,
    currentQueueTime: 5,
    location: [19.3013, -99.1505],
    accessibilityFeatures: ['elevators', 'hearing-loops'],
  },
  {
    id: 'gate-d',
    name: 'Gate D (West)',
    status: 'open',
    throughput: 150,
    currentQueueTime: 10,
    location: [19.3029, -99.1525],
    accessibilityFeatures: ['ramps', 'elevators'],
  },
];

export const VENDORS: Vendor[] = [
  {
    id: 'tacos-el-pastor',
    name: 'Azteca Tacos',
    type: 'food',
    location: [19.3035, -99.1515],
    queueTime: 15,
    specialties: ['Tacos', 'Sodas'],
    isSustainable: true,
    isAccessible: true,
  },
  {
    id: 'burger-stadium',
    name: 'World Burger',
    type: 'food',
    location: [19.3025, -99.1495],
    queueTime: 8,
    specialties: ['Burgers', 'Fries'],
    isSustainable: false,
    isAccessible: true,
  },
  {
    id: 'merch-north',
    name: 'Official Merch Shop',
    type: 'merchandise',
    location: [19.304, -99.1505],
    queueTime: 20,
    specialties: ['Jerseys', 'Scarves'],
    isSustainable: true,
    isAccessible: true,
  },
];

export const TRANSIT_ROUTES: TransitRoute[] = [
  {
    id: 'metro-line-1',
    type: 'metro',
    name: 'Stadium Express (Blue)',
    status: 'on-time',
    frequency: 3,
    nextArrival: '2026-07-06T14:35:00Z',
    loadFactor: 0.85,
    stations: [
      { name: 'Downtown', location: [19.4326, -99.1332] },
      { name: 'Stadium Central', location: [19.3029, -99.1555] },
    ],
  },
  {
    id: 'shuttle-fan-park',
    type: 'shuttle',
    name: 'Fan Park Shuttle',
    status: 'delayed',
    frequency: 10,
    nextArrival: '2026-07-06T14:45:00Z',
    loadFactor: 0.4,
    stations: [
      { name: 'Fan Park North', location: [19.32, -99.15] },
      { name: 'Stadium East Gate', location: [19.3029, -99.148] },
    ],
  },
];
