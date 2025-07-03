import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thceupkmlmusckmveele.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoY2V1cGttbG11c2NrbXZlZWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDY0NDgsImV4cCI6MjA2MzY4MjQ0OH0.Zrb8fGdBm6M8gO-fYtOd-mMO7n3X7OYFhdZk7Px1DQQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);