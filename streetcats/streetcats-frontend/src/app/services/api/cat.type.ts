export interface Cat {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  size: string | null;
  photoUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  UserEmail: string;
  createdAt: string;
  updatedAt?: string;
}
