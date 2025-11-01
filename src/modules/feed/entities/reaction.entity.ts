export class Reaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'support' | 'insightful';
  created_at: string;
}
