import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gpveutlgrnwdpjnqtkou.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwdmV1dGxncm53ZHBqbnF0a291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODU4MDIsImV4cCI6MjA3MTE2MTgwMn0.blE-jCB16jLnuw-NIrHTHy_tVEj4ALnBxCkWox_SiXc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to test admin access using Supabase RPC
export async function testAdminAccess() {
  try {
    const { data, error } = await supabase.rpc('test_admin_access');
    
    if (error) {
      console.error('RPC Error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Admin access test result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
}
