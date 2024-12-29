import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { newsService } from '../lib/services/news';
import { formatDistanceToNow } from 'date-fns';

interface Hashtag {
  name: string;
  tweet_count: number;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export default function TrendingTopics() {
  const [trending, setTrending] = useState<Hashtag[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const { data } = await supabase
        .from('hashtags')
        .select('name, tweet_count')
        .order('tweet_count', { ascending: false })
        .limit(5);

      if (data) {
        setTrending(data);
      }
    };

    const fetchNews = async () => {
      const newsItems = await newsService.getTopNews();
      setNews(newsItems);
    };

    fetchTrending();
    fetchNews();

    const interval = setInterval(() => {
      fetchTrending();
      fetchNews();
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Trending Hashtags */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Trending Topics</h2>
        <div className="space-y-4">
          {trending.map((tag) => (
            <div key={tag.name} className="space-y-1">
              <p className="font-medium text-blue-500 dark:text-blue-400">#{tag.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tag.tweet_count} tweets</p>
            </div>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Latest News</h2>
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.url} className="space-y-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                  <span>{item.source.name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}