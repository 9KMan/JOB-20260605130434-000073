export type UserRole = 'ADMIN' | 'MANAGER' | 'CHEF' | 'STAFF' | 'AUDITOR';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
  phone?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type ChecklistStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export type ChecklistFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedBy?: string | null;
  completedAt?: string | null;
  notes?: string;
}

export interface Checklist {
  id: string;
  title: string;
  description?: string;
  status: ChecklistStatus;
  frequency: ChecklistFrequency;
  dueDate: string;
  assignedTo?: User | null;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export type UnitOfMeasure = 'KG' | 'G' | 'L' | 'ML' | 'UNIT' | 'PACK' | 'BOX';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: UnitOfMeasure;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  unitCost: number;
  supplier?: string | null;
  expiresAt?: string | null;
  lastCountedAt?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductionOrderStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  unit: UnitOfMeasure;
  status: ProductionOrderStatus;
  scheduledFor: string;
  startedAt?: string | null;
  completedAt?: string | null;
  assignedTo?: User | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AuditStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'REQUIRES_ACTION';

export interface Audit {
  id: string;
  title: string;
  auditType: string;
  status: AuditStatus;
  scheduledFor: string;
  completedAt?: string | null;
  auditor?: User | null;
  score?: number | null;
  findings: AuditFinding[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type FindingSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AuditFinding {
  id: string;
  description: string;
  severity: FindingSeverity;
  isResolved: boolean;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  correctiveAction?: string;
}

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export interface StaffMember {
  id: string;
  user: User;
  position: string;
  department: string;
  hireDate: string;
  isActive: boolean;
  shifts: StaffShift[];
}

export interface StaffShift {
  id: string;
  staffId: string;
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
  date: string;
  isPresent?: boolean | null;
  notes?: string;
}

export type NotificationType = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'TASK';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
  readAt?: string | null;
}

export interface DashboardStats {
  openChecklists: number;
  completedChecklistsToday: number;
  lowStockItems: number;
  pendingProductionOrders: number;
  upcomingAudits: number;
  unreadNotifications: number;
  staffOnShift: number;
}
