import { useEffect, useState } from 'react';
import { useHashtags } from '../../hooks/useHashtags';
import { useNews } from '../../hooks/useNews';
import HashtagList from './HashtagList';
import NewsFeed from './NewsFeed';

export default function TrendingTopics() {
  const { hashtags } = useHashtags();
  const { news } = useNews();

  return (
    <div className="space-y-6">
      <HashtagList hashtags={hashtags} />
      <NewsFeed news={news} />
    </div>
  );
}