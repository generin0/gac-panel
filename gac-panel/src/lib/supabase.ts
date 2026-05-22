import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bpwuiewpgxtyykcnsnpq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwd3VpZXdwZ3h0eXlrY25zbnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjU4NjYsImV4cCI6MjA5NDkwMTg2Nn0.aJZnBTwzs8bIHeYnxUA2eRR51Wz1QLKHcaVKwTUf6EY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)