// 🔌 SupabaseClientProvider
// Este archivo crea una conexión única con Supabase usando las variables del archivo .env.
// Se exporta como un "proveedor" para que otros módulos (como auth.service) puedan usarlo sin crear nuevas conexiones.

import { Provider } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

export const SupabaseClientProvider: Provider = {
  provide: SUPABASE_CLIENT,
  useFactory: (): SupabaseClient => {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
    return createClient(url, key);
  },
};
