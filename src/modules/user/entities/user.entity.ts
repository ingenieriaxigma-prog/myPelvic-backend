export class User {
  id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: 'user' | 'specialist' | 'admin';
  created_at?: string;
}
