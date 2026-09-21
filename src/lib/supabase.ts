import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ounvmeieamhnaipljgdf.supabase.co';
const supabaseAnonKey = 'sb_publishable_gp0vYhetAGgDkn1tnQ4eGA_fTUSv5Ct';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
