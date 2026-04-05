// Supabase client - novo projeto
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const url = "https://qdntmxpbfynjwvljdufl.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbnRteHBiZnluand2bGpkdWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY5MTMsImV4cCI6MjA5MDkyMjkxM30.5amluoYczyf1HBshB8hNA_vJ_sMxQ5nYvX8HAKbqaKU";

export const supabase = createClient<Database>(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
