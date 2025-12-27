import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req) {
  if (!supabaseServiceKey) {
    return Response.json({ error: 'Service role key not configured' }, { status: 500 });
  }

  // Verify requester is authenticated (requires Bearer token)
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate token using anon client
  const anonClient = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  const { data: userData, error: userErr } = await anonClient.auth.getUser(token);
  if (userErr || !userData?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Proceed with service client to list users
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });

  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Map users to include only necessary fields
    const admins = data.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || u.email
    }));

    return Response.json({ admins });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
