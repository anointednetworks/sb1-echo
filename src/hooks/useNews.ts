import { useState, useEffect } from 'react';
import { type NewsItem } from '../types/news';
import { newsService } from '../lib/services/news';

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await newsService.getTopNews();
      setNews(data);
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return { news };
}