export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Question {
  _id?: string;
  type: 'text' | 'multiple-choice';
  question: string;
  options?: string[];
  required: boolean;
}

export interface Form {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  responseCount: number;
}

export interface FormResponse {
  _id: string;
  formId: string;
  responses: Record<string, string>;
  submittedAt: string;
  ipAddress?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface FormStats {
  totalResponses: number;
  averageCompletionTime?: number;
  responsesByDate: Record<string, number>;
}