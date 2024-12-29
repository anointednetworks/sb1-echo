import { type NewsItem } from '../../types/news';
import { formatDistanceToNow } from 'date-fns';

interface NewsFeedProps {
  news: NewsItem[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 glow-white">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Latest News</h2>
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.url} className="space-y-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
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
  );
}