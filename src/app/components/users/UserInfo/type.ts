export interface UserInfoProps {
  name: string;
  year?: number;
  class?: string;
  number?: number;
  accountId: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPERADMIN';
  status?: 'APPROVED' | 'PENDING' | 'DENIED';
  password?: string;
}