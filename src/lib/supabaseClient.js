import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-application-name': 'rent-boats-marketplace'
    }
  }
});

// Helper functions for common operations
export const auth = {
  signUp: async (email, password, options = {}) => {
    return await supabase.auth.signUp({ email, password, options });
  },
  
  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },
  
  getSession: () => {
    return supabase.auth.getSession();
  },
  
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Generic query helper
  from: (table) => supabase.from(table),
  
  // Boats operations
  boats: {
    getAll: () => supabase.from('boats').select('*'),
    getById: (id) => supabase.from('boats').select('*').eq('id', id).single(),
    create: (boat) => supabase.from('boats').insert(boat),
    update: (id, updates) => supabase.from('boats').update(updates).eq('id', id),
    delete: (id) => supabase.from('boats').delete().eq('id', id)
  },
  
  // Bookings operations
  bookings: {
    getAll: () => supabase.from('bookings').select('*'),
    getById: (id) => supabase.from('bookings').select('*').eq('id', id).single(),
    getByUserId: (userId) => supabase.from('bookings').select('*').eq('user_id', userId),
    create: (booking) => supabase.from('bookings').insert(booking),
    update: (id, updates) => supabase.from('bookings').update(updates).eq('id', id),
    delete: (id) => supabase.from('bookings').delete().eq('id', id)
  }
};

// Storage helpers
export const storage = {
  upload: async (bucket, path, file) => {
    return await supabase.storage.from(bucket).upload(path, file);
  },
  
  download: async (bucket, path) => {
    return await supabase.storage.from(bucket).download(path);
  },
  
  getPublicUrl: (bucket, path) => {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },
  
  delete: async (bucket, paths) => {
    return await supabase.storage.from(bucket).remove(paths);
  }
};

export default supabase;
