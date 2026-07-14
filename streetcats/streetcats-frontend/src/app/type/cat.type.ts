export interface Cat {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  size: string | null;
  catImageUrl: string | null;
  latitude: number;
  longitude: number;
  UserEmail: string;
  createdAt: string;
  updatedAt?: string;
}
