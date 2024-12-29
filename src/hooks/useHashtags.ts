import { useState, useEffect } from 'react';
import { type Hashtag } from '../types/hashtag';
import { hashtagService } from '../lib/services/hashtag';

export function useHashtags() {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);

  useEffect(() => {
    const fetchHashtags = async () => {
      const data = await hashtagService.getTrending();
      setHashtags(data);
    };

    fetchHashtags();
    const interval = setInterval(fetchHashtags, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return { hashtags };
}