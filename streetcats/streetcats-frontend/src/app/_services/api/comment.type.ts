export interface Comment {
  id: number;
  text: string;
  UserEmail: string;
  createdAt: string;
  updatedAt?: string;
  CatId?: number;
  cat?: {
    id: number;
    name: string;
  };
}
