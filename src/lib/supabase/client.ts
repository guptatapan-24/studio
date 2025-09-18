"use client";

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // TODO: Replace with your Supabase project's URL and anon key
  return createBrowserClient(
    "https://txrfyhbdpauhrrfgjrqi.supabase.co"!,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cmZ5aGJkcGF1aHJyZmdqcnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxODYyMDEsImV4cCI6MjA3Mzc2MjIwMX0.8tXRxKMH-76sxWRKO9J7YdPae8B_EJ8CvA6ln9c7oF4"!
  )
}
