import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchArtikelData() {
  const { data, error } = await supabase.from('artikel').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchDusunData() {
  const { data, error } = await supabase.from('dusun').select('*');
  if (error) throw error;
  return data;
}

export async function fetchAdminUsers() {
  // This function would need server-side access to auth admin API
  // For now, we'll return an empty array since client-side can't access admin API
  // A separate server action or API route would be needed for this
  return [];
}
