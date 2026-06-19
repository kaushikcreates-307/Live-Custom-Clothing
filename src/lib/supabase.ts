import { createClient } from '@supabase/supabase-js';

// Ensure these strings start with https:// and match your project dashboard exactly
const supabaseUrl = 'https://ssddgyqeesqehvmfnefl.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZGRneXFlZXNxZWh2bWZuZWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Mzk2MTYsImV4cCI6MjA5NzQxNTYxNn0.0KFyvTHHUguuuaA0xeYh2U2qNCbbrxE7Nf68Sr2j2Lg'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);