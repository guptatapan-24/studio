
'use server';

import { createClient } from '@/lib/supabase/server';

export type BestScore = {
  level_id: number;
  strokes: number;
};

// Function to get all best scores for the current user
export async function getBestScores(): Promise<BestScore[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('scores')
    .select('level_id, strokes');

  if (error) {
    console.error("Error fetching scores:", error.message);
    return [];
  }
  
  return data || [];
}

// Function to call the database function to update a score
export async function updateBestScore(levelId: number, strokes: number): Promise<{ error: any }> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { error } = await supabase.rpc('update_score', {
    level_id_in: levelId,
    strokes_in: strokes,
  });

  if (error) {
    console.error(`Error updating score for level ${levelId}:`, error.message);
  }

  return { error };
}
