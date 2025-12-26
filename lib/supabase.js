export async function fetchArtikelData() {
  const { data, error } = await supabase.from('artikel').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchDusunData() {
  const { data, error } = await supabase.from('dusun').select('*');
  if (error) throw error;
  return data;
}
