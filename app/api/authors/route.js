import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req) {
  if (!supabaseServiceKey) {
    return Response.json({ error: 'Service role key not configured' }, { status: 500 });
  }

  const { authorIds } = await req.json();

  if (!Array.isArray(authorIds) || authorIds.length === 0) {
    return Response.json({ authors: [] });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });

  try {
    const authors = [];
    for (const id of authorIds) {
      try {
        const { data, error } = await supabase.auth.admin.getUserById(id);
        if (error) {
          authors.push({ id, name: id });
          continue;
        }
        const user = data?.user ?? data; // supabase-js may return { user }
        const name = user?.user_metadata?.name || user?.email || id;
        authors.push({ id, name });
      } catch (e) {
        authors.push({ id, name: id });
      }
    }

    return Response.json({ authors });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
