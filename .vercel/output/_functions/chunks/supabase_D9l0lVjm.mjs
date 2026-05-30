import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xscdlrkvhmjgjbnpzjxj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzY2Rscmt2aG1qZ2pibnB6anhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTUzMjgsImV4cCI6MjA5NTczMTMyOH0.5QRoy66z2D6bl9bEAy14OIrsdS5J8fDb1vM3Zc6roc0";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzY2Rscmt2aG1qZ2pibnB6anhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE1NTMyOCwiZXhwIjoyMDk1NzMxMzI4fQ.HMsx1Kw2go7uF8cFG84b5slnS5uBWVw5TT5D8ZXhdgI";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
}) ;

export { supabaseAdmin as a, supabase as s };
