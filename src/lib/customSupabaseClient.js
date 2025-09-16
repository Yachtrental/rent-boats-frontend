import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gpveutlgrnwdpjnqtkou.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwdmV1dGxncm53ZHBqbnF0a291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODU4MDIsImV4cCI6MjA3MTE2MTgwMn0.blE-jCB16jLnuw-NIrHTHy_tVEj4ALnBxCkWox_SiXc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);