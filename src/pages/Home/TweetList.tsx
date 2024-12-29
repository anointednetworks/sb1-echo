import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Tweet from './Tweet';

interface TweetData {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  likes: { id: string }[];
  comments: { id: string }[];
}

export default function TweetList({ refresh }: { refresh?: number }) {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const { data, error } = await supabase
          .from('tweets')
          .select(`
            *,
            profiles (username, full_name, avatar_url),
            likes ( id ),
            comments ( id )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTweets(data || []);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [refresh]);

  if (loading) {
    return <div className="text-center py-4">Loading tweets...</div>;
  }

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}