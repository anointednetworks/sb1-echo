import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';
import toast from 'react-hot-toast';

interface TweetProps {
  tweet: {
    id: string;
    content: string;
    media_url?: string[] | null;
    created_at: string;
    profiles: {
      username: string;
      full_name: string;
      avatar_url: string;
    };
    likes: { id: string }[];
    comments: { id: string }[];
  };
}

export default function Tweet({ tweet }: TweetProps) {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(
    tweet.likes.some(like => like.id === user?.id)
  );
  const [likesCount, setLikesCount] = useState(tweet.likes.length);

  const handleLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
        setLikesCount(prev => prev - 1);
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: user.id, tweet_id: tweet.id });
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error('Failed to like echo');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex space-x-3">
        <img
          src={tweet.profiles.avatar_url || 'https://via.placeholder.com/40'}
          alt={tweet.profiles.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Link to={`/profile/${tweet.profiles.username}`} className="font-semibold hover:underline dark:text-white">
              {tweet.profiles.full_name}
            </Link>
            <span className="text-gray-500 dark:text-gray-400">@{tweet.profiles.username}</span>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(tweet.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-2 dark:text-gray-200 whitespace-pre-wrap">{tweet.content}</p>
          
          {tweet.media_url && tweet.media_url.length > 0 && (
            <div className="mt-3">
              <img
                src={tweet.media_url[0]}
                alt="Tweet media"
                className="rounded-lg max-h-96 w-auto"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex items-center space-x-6 mt-3 text-gray-500 dark:text-gray-400">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 hover:text-red-500 ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
              <span>{likesCount}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <MessageCircle className="w-5 h-5" />
              <span>{tweet.comments.length}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500">
              <Repeat2 className="w-5 h-5" />
              <span>0</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}