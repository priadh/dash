import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://hnqhcnzsquryeqsqmvem.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucWhjbnpzcXVyeWVxc3FtdmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTM0MjUsImV4cCI6MjA2MDAyOTQyNX0.nmUq6_ieG1ilsdKJuaveBxHa30x1acD0TWrKOSzU6Mo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
