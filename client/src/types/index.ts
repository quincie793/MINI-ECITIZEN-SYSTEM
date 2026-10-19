export interface User {
  id: number;
  name: string;
  role: 'CITIZEN' | 'ADMIN';
}

export interface ServiceRequest {
  id: number;
  category: string;
  location: string;
  description: string;
  imageUrl: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}
