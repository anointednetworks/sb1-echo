import { supabase } from '../supabase';
import { type Hashtag } from '../../types/hashtag';

export const hashtagService = {
  async getTrending(): Promise<Hashtag[]> {
    const { data, error } = await supabase
      .from('hashtags')
      .select('name, tweet_count')
      .order('tweet_count', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Failed to fetch hashtags:', error);
      return [];
    }

    return data || [];
  }
};