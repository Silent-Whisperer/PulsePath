/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LayoutDashboard,
  Map as MapIcon,
  MessageSquare,
  Leaf,
  Users,
  ShieldAlert,
  BarChart3,
  BrainCircuit,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

export const fanNav: NavItem[] = [
  { name: 'Match Journey', path: '/fan', icon: LayoutDashboard },
  { name: 'AI Navigation', path: '/fan/navigate', icon: MapIcon },
  { name: 'Ask Pulse', path: '/fan/assistant', icon: MessageSquare },
  { name: 'Sustainability', path: '/fan/impact', icon: Leaf },
];

export const opsNav: NavItem[] = [
  { name: 'Command Center', path: '/operations', icon: LayoutDashboard },
  { name: 'Crowd Intel', path: '/operations/crowd', icon: BarChart3 },
  { name: 'Live Alerts', path: '/operations/alerts', icon: ShieldAlert },
  { name: 'AI Copilot', path: '/operations/insights', icon: BrainCircuit },
];

export const volNav: NavItem[] = [{ name: 'Task Hub', path: '/volunteer', icon: Users }];
