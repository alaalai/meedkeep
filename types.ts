import React from 'react';

export enum DeviceStatus {
  Operational = 'OPERATIONAL',
  MaintenanceRequired = 'MAINTENANCE_REQUIRED',
  OutOfOrder = 'OUT_OF_ORDER',
  UnderRepair = 'UNDER_REPAIR'
}

export enum TicketPriority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  Critical = 'CRITICAL'
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  location: string; // e.g., "Riyadh - King Salman Hospital"
  department: string;
  status: DeviceStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  image?: string;
}

export interface Ticket {
  id: string;
  equipmentId: string;
  title: string;
  description: string;
  reportedBy: string;
  dateCreated: string;
  priority: TicketPriority;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  aiAnalysis?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}