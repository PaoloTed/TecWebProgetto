export interface User {
  userName: string;
  email: string;
  role: string;
  createdAt?: string;
  stats?: {
    cats: number;
    comments: number;
  };
  recentCats?: any[];
  recentComments?: any[];
}
