export interface UserInfoProps {
  name: string;
  year?: number;
  class?: string;
  number?: number;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPERADMIN';
  status?: 'APPROVED' | 'PENDING' | 'DENIED';
}