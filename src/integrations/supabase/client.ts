// Supabase client - updated
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://qdntmxpbfynjwvljdufl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbnRteHBiZnluand2bGpkdWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDY5MTMsImV4cCI6MjA5MDkyMjkxM30.5amluoYczyf1HBshB8hNA_vJ_sMxQ5nYvX8HAKbqaKU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
