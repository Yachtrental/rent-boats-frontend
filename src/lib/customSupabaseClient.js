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
// En tu customSupabaseClient.js, añade esta función de prueba:
export async function testAuthenticatedAdmin() {
  try {
    console.log('=== PRUEBA DE ADMINISTRADOR AUTENTICADO ===');
    
    // Verificar sesión actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('1. Estado de sesión:');
    console.log('   - Sesión existe:', !!session);
    console.log('   - Email:', session?.user?.email);
    console.log('   - User ID:', session?.user?.id);
    console.log('   - Metadatos:', session?.user?.user_metadata);
    
    if (!session) {
      console.log('❌ NO HAY SESIÓN ACTIVA - Necesitas hacer login primero');
      return null;
    }
    
    // Llamar a test_admin_access con usuario autenticado
    console.log('2. Llamando a test_admin_access...');
    const { data: testData, error: testError } = await supabase.rpc('test_admin_access');
    
    console.log('3. Resultado de test_admin_access:');
    console.log('   - Data:', testData);
    console.log('   - Error:', testError);
    
    // Consulta directa a perfiles con RLS
    console.log('4. Consulta directa a perfiles...');
    const { data: profileData, error: profileError } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    console.log('   - Profile data:', profileData);
    console.log('   - Profile error:', profileError);
    
    // Resultado final
    const isAdmin = testData?.[0]?.is_admin_result || false;
    console.log('5. RESULTADO FINAL:');
    console.log('   - Es admin:', isAdmin);
    
    if (isAdmin) {
      console.log('✅ USUARIO CONFIRMADO COMO ADMINISTRADOR');
      return true;
    } else {
      console.log('❌ Usuario NO es administrador');
      return false;
    }
    
  } catch (error) {
    console.error('Error en test:', error);
    return null;
  }
}
