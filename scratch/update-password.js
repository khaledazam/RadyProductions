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
  const newPassword = '123456';

  console.log(`Searching for user ${email}...`);

  // List users to find the ID
  const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (listError) {
    console.error("Failed to list users:", listError.message);
    process.exit(1);
  }

  const user = data.users.find(u => u.email === email);
  
  if (!user) {
    console.error(`User with email ${email} not found.`);
    process.exit(1);
  }

  console.log(`User found (ID: ${user.id}). Updating password to "${newPassword}"...`);

  // Update password
  const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );

  if (updateError) {
    console.error("Failed to update password:", updateError.message);
  } else {
    console.log(`Successfully updated password for ${email} to: ${newPassword}`);
  }
}

main();
