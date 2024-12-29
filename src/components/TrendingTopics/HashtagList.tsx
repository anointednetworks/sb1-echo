import { type Hashtag } from '../../types/hashtag';

interface HashtagListProps {
  hashtags: Hashtag[];
}

export default function HashtagList({ hashtags }: HashtagListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 glow-white">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Trending Topics</h2>
      <div className="space-y-4">
        {hashtags.map((tag) => (
          <div key={tag.name} className="space-y-1 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <p className="font-medium text-blue-500 dark:text-blue-400">#{tag.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tag.tweet_count} tweets</p>
          </div>
        ))}
      </div>
    </div>
  );
}