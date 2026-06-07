import { Cat } from './cat.type';
import { Comment } from './comment.type';

export interface User {
  userName: string;
  email: string;
  role: string;
}

export interface UserProfile extends User {
  createdAt: string;
  stats?: {
    cats: number;
    comments: number;
  };
  recentCats?: Cat[];
  recentComments?: Comment[];
}
