"use client";

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // TODO: Replace with your Supabase project's URL and anon key
  return createBrowserClient(
    "YOUR_SUPABASE_URL_HERE"!,
    "YOUR_SUPABASE_ANON_KEY_HERE"!
  )
}
