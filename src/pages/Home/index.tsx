import { useState } from 'react';
import TweetForm from './TweetForm';
import TweetList from './TweetList';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTweetCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <TweetForm onTweetCreated={handleTweetCreated} />
      <TweetList refresh={refreshKey} />
    </div>
  );
}