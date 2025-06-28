import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://emrcvdtsrahnneqisdzqt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcmN2ZHRzcmFobmVxaXNkenF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTEwODExOCwiZXhwIjoyMDY2Njg0MTE4fQ.HnXVsVPu2m_a778b7JOKgBh-jHrG8rjlvYrRQ7mB08k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});