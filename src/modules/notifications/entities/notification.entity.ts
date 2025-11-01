export class Notification {
  id: string;
  user_id: string;      // destinatario
  actor_id: string;     // quien causó la acción
  post_id?: string;
  type: 'reaction' | 'comment';
  message: string;
  read: boolean;
  created_at: string;
}
