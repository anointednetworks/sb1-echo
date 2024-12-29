import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';
import MediaUpload from '../../components/MediaUpload';
import EmojiPicker from '../../components/EmojiPicker';
import toast from 'react-hot-toast';

interface TweetFormData {
  content: string;
}

export default function TweetForm({ onTweetCreated }: { onTweetCreated: () => void }) {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const { register, handleSubmit, reset, watch, setValue } = useForm<TweetFormData>();
  const content = watch('content', '');

  const onSubmit = async (data: TweetFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('tweets')
        .insert([{ 
          user_id: user.id, 
          content: data.content,
          media_url: mediaUrl ? [mediaUrl] : null
        }]);

      if (error) throw error;
      
      toast.success('Echo posted!');
      reset();
      setMediaUrl(null);
      onTweetCreated();
    } catch (error) {
      toast.error('Failed to post echo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setValue('content', content + emoji);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <textarea
        {...register('content', { required: true, maxLength: 280 })}
        className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent dark:text-white"
        placeholder="What's happening?"
        rows={3}
      />
      
      {mediaUrl && (
        <div className="mt-2 relative">
          <img 
            src={mediaUrl} 
            alt="Upload preview" 
            className="rounded-lg max-h-64 w-auto"
          />
          <button
            type="button"
            onClick={() => setMediaUrl(null)}
            className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-2">
        <div className="flex space-x-2">
          <MediaUpload onUploadComplete={setMediaUrl} />
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {content.length}/280
          </span>
          <button
            type="submit"
            disabled={isSubmitting || content.length === 0 || content.length > 280}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Echo'}
          </button>
        </div>
      </div>
    </form>
  );
}