export type RequestStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Cancelled';

export interface AbsenceType {
  id: string;
  code: string;
  nameEn: string;
  nameEs: string;
  isActive: boolean;
}

export interface Request {
  id: string;
  employeeId: string;
  absenceTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  approverId?: string;
  approvalComment?: string;
  createdAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Employee' | 'Manager';
}

export interface UpdateRequestData {
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ApprovalData {
  comment: string;
}
