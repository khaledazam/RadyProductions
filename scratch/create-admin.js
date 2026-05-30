import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env variables not found.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function main() {
  const email = 'admin@rady.com';
  const password = 'Bfud3oeMwTs3LrrZ';

  console.log(`Creating admin user: ${email}...`);

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('email_exists')) {
      console.log(`User ${email} already exists in Supabase Auth.`);
    } else {
      console.error("Failed to create admin user:", error.message);
    }
  } else {
    console.log(`Successfully created admin user: ${email} with password: ${password}`);
  }
}

main();
