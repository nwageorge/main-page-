
export enum UserRole {
  CAREGIVER = 'CAREGIVER',
  FAMILY = 'FAMILY',
  ADMIN = 'ADMIN',
  ENTERPRISE = 'ENTERPRISE'
}

export enum TaskPriority {
  CRITICAL = 'CRITICAL', // Meds, Safety
  STANDARD = 'STANDARD', // Housekeeping
  LOW = 'LOW', // Social
  JOY = 'JOY' // Fun Activities & Moments
}

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
  REFUSED = 'REFUSED'
}

export interface Evidence {
  id: string;
  type: 'PHOTO' | 'NOTE';
  content: string; // URL or text
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startTime: string; // HH:MM format for demo
  endTime: string;
  priority: TaskPriority;
  status: TaskStatus;
  requiredEvidence: boolean;
  evidence?: Evidence[];
}

export interface ShiftSession {
  isActive: boolean;
  startTime?: number;
  caregiverName: string;
}

export interface ShiftRecord {
  id: string;
  startTime: number;
  endTime: number;
}

export interface Caregiver {
  id: string;
  name: string;
  title: string;
  rating: number;
  totalShifts: number;
  reliabilityScore: number;
  certifications: string[];
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface MetricData {
  name: string;
  value: number;
}

export interface VitalRecord {
  value: string | number; // e.g., "120/80" or 98.6
  unit: string;
  timestamp: number;
  evidencePhotoUrl?: string; // The photo taken by caregiver
  dayLabel?: string; // For chart display (e.g., "Mon")
  splitValue?: { sys: number, dia: number }; // For BP charts
}

export interface VitalRegistry {
  bloodPressure: {
    current: string;
    history: VitalRecord[];
  };
  temperature: {
    current: number;
    history: VitalRecord[];
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string | null;
}